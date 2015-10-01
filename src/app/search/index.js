var piApp = angular.module('pi.search', []);

piApp.controller('SearchCtrl', function (translateResource, $q) {
  var _self = this;
  var gifMap = new Map();
  this.browsing = false;
  this.loading = true;
  this.term = '';
  this.gifs = [];
  this.lastTerm = '';
  this.noresults = false; //No Results flag

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
    let translatePromises = [];
    for (let i = 6; i > 0; i--) {
      translatePromises.push(translateResource.get({
        s: term
      }).$promise);
    }

    $q.all(translatePromises).then(responses => {
      let newGifs = [];
      responses.forEach(resp => {
        if (resp.data.images) {
          _self.noresults = false;
          //TODO: check for dupes
          newGifs.push(resp.data.images.fixed_height_small.url);
          gifMap.set(resp.data.images.fixed_height_small.url, resp.data.images.original.url);
        } else {
          _self.noresults = true;
        }
      });
      _self.loading = false;
      _self.gifs = newGifs;
    });
  }

});

export default piApp;
