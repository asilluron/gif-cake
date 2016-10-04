/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	__webpack_require__(3);
	__webpack_require__(4);

	var app = angular.module('pi', ['pi.search', 'pi.resources']);

	app.directive('drFocus', function ($timeout) {
	  return {
	    scope: {
	      trigger: '@browsing'
	    },
	    link: function (scope, element) {
	      scope.$watch('trigger', function (value) {
	        if (value === 'false') {
	          $timeout(function () {
	            element[0].focus();
	          });
	        }
	      });
	    }
	  };
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var translateResource = __webpack_require__(2);

	var resources = angular.module('pi.resources', ['ngResource']);
	resources.service('translateResource', translateResource);

	module.exports = resources;

/***/ },
/* 2 */
/***/ function(module, exports) {

	var translateResource = function ($resource, API_KEY, API_URL) {
	  return $resource(API_URL + '/translate', {
	    api_key: API_KEY
	  });
	};

	translateResource.$inject = ['$resource', 'API_KEY', 'API_URL'];

	module.exports = translateResource;

/***/ },
/* 3 */
/***/ function(module, exports) {

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
	    set: n => {}
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
	      for (let j = 6 - resolveCount; j > 0; j--) {
	        _self.gifs = _self.gifs.concat([PLACEHOLDER_IMAGE]);
	      }

	      _self.loading = false;
	    });
	  }
	});

	module.exports = piApp;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(5);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(7)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(6)();
	// imports


	// module
	exports.push([module.id, "body {\n  font-family: \"Lucida Sans Unicode\", \"Lucida Grande\", sans-serif;\n  -webkit-app-region: drag;\n  background-color: #343838;\n  color: #FFF;\n  margin: 0px;\n  padding: 0px;\n  overflow: hidden; }\n\ninput {\n  border: 0;\n  color: #FFF;\n  font-size: 48px;\n  width: 550px;\n  text-align: center;\n  outline: none;\n  background-size: 125px; }\n\n.notice {\n  text-align: center;\n  position: relative; }\n\n.image-wrapper {\n  width: 200px;\n  height: 150px;\n  float: left;\n  overflow: hidden; }\n\nimg {\n  display: block;\n  margin: 0 auto;\n  max-width: 200px;\n  height: 100%; }\n\n.scene {\n  height: 200px;\n  width: 100%; }\n\n.loader {\n  height: 400px;\n  text-align: center;\n  vertical-align: middle;\n  width: 600px; }\n\n.loader img {\n  display: block;\n  margin: 0 auto;\n  max-width: 25px;\n  height: 25px; }\n\n.help--browsing {\n  position: fixed;\n  left: 0px;\n  top: 0px;\n  font-size: 12px;\n  opacity: 0.6; }\n\n.help--copy {\n  position: fixed;\n  right: 0px;\n  top: 0px;\n  font-size: 12px;\n  color: lime; }\n\n.help {\n  position: fixed;\n  left: 20px;\n  top: 45px;\n  font-size: 12px;\n  opacity: 0.5; }\n", ""]);

	// exports


/***/ },
/* 6 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }
/******/ ]);