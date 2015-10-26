var piApp = angular.module('pi.search', []);

piApp.controller('SearchCtrl', function (translateResource, $q) {
  var _self = this;
  const PLACEHOLDER_IMAGE = 'https://placeholdit.imgix.net/~text?txtsize=33&txt=No%20Result&w=200&h=150';
  var gifMap = new Map();
  this.browsing = false;
  this.loading = true;
  this.term = '';
  this.error = null;
  this.gifs = [];
  this.lastTerm = '';
  this.noresults = false; //No Results flag

  //TODO: Abstract NWJS utils into a service
  var clipboard = typeof gui !== 'undefined' ? gui.Clipboard.get() : {
    set: n => {
    }
  };

  this.keydown = e => {

    switch (e.keyCode) {
      case 27:
        win.hide();
        reset();
        break;
      case 9:
        //We got a tab
        if (this.browsing) {
          //Skip to next image
          if (_self.noresults === false) {
            //Don't allow a new search if know it's a dud
            search(this.lastTerm);
          }
        }
        break;
      case 13:
        if (!this.browsing) {
          //Begin the search !
          this.browsing = true;
          search(this.term);
          this.lastTerm = this.term;
          this.term = '';
        }
        break;
      default:
        if (this.browsing === true) {
          reset();
        }
    }
  };

  this.setClipboard = function (urlSmall) {
    var originalUrl = gifMap.get(urlSmall);
    clipboard.set(originalUrl, 'text');
    //TODO: Make this test safe
    win.hide();
    reset();
  };

  function reset() {
    _self.browsing = false;
    _self.gifs = [];
    _self.noresults = false;
  }

  function search(term) {
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
            _self.noresults = false;
            resolveCount++;
            _self.gifs = _self.gifs.concat([resp.data.images.fixed_height_small.url]);
            gifMap.set(resp.data.images.fixed_height_small.url, resp.data.images.original.url);
          }
        }
      }, err => {
        _self.error = 'Problem contacting Giphy, Please Try Again'; //TODO: i18n THIS
      });
    }

    $q.all(translatePromises).finally(() => {
      for (let j = (6 - resolveCount); j > 0; j--) {
        _self.gifs = _self.gifs.concat([PLACEHOLDER_IMAGE]);
      }

      _self.loading = false;
    });
  }

});

export default piApp;
