'use strict';

var piApp = angular.module('pi.search', []);

piApp.controller('SearchCtrl', function (translateResource, $q, $scope, $timeout) {
  var _self = this;
  const PLACEHOLDER_IMAGE = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=No%20Result&w=200&h=150';
  var gifMap = new Map();
  this.browsing = false;
  this.loading = true;
  this.term = '';
  this.error = null;
  this.gifs = [];
  this.lastTerm = '';
  this.noresults = false; // No Results flag
  this.copied = false;

  // TODO: Abstract NWJS utils into a service
  var clipboard = typeof nw !== 'undefined' ? nw.Clipboard.get() : {
    set: n => {
    }
  };

  var reset = lastChar => {
    gifMap = new Map();
    _self.browsing = false;
    _self.gifs = [];
    _self.noresults = false;
    if (lastChar) {
      this.term = lastChar;
    }
  };

  this.keydown = e => {

    switch (e.keyCode) {
      case 27:
        win.hide();
        reset();
        break;
      case 9:
        // We got a tab
        if (this.browsing) {
          // Skip to next image
          if (_self.noresults === false) {
            // Don't allow a new search if know it's a dud
            _self.gifs = [];
            gifMap = new Map();
            search(this.lastTerm);
          }
        }
        break;
      case 13:
        if (!this.browsing) {
          // Begin the search !
          this.browsing = true;
          search(this.term);
          this.lastTerm = this.term;
          this.term = '';
        }
        break;
      default:
        if (this.browsing === true && /[a-zA-Z0-9-_ ]/.test(e.key)) {
          reset(e.key);
        }
    }
  };

  this.setClipboard = urlSmall => {
    var originalUrl = gifMap.get(urlSmall);
    clipboard.set(originalUrl, 'text');
    this.copied = true;
    $timeout(() => {
      this.copied = false;
    }, 1500);
  };

  function search (term) {
    _self.loading = true;
    let translatePromises = [],
      resolveCount = 0;
    for (let i = 6; i > 0; i--) {
      let resultsPromise = translateResource.get({
        s: term
      }).$promise;

      translatePromises.push(resultsPromise);

      resultsPromise.then(resp => {
        if (resp.data.images) {
          let dupeCheck = gifMap.get(resp.data.images.fixed_height_small.url);
          if (typeof dupeCheck === 'undefined') {
            resolveCount++;
            _self.gifs = _self.gifs.concat([resp.data.images.fixed_height_small.url]);
            gifMap.set(resp.data.images.fixed_height_small.url, resp.data.images.original.url);
          }
        }
      }, err => {
        _self.error = 'Problem contacting Giphy, Please Try Again'; // TODO: i18n THIS
      });
    }

    $q.all(translatePromises).finally(() => {
      if (resolveCount === 0) {
        _self.noresults = true;
      } else {
        _self.noresults = false;
      }
      for (let j = (6 - resolveCount); j > 0; j--) {
        _self.gifs = _self.gifs.concat([PLACEHOLDER_IMAGE]);
      }

      _self.loading = false;
    });
  }

});

module.exports = piApp;
