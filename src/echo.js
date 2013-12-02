window.Echo = (function (window, document, undefined) {

  'use strict';

  var store;

  var _inView = function (img) {
    var coords = img.getBoundingClientRect();
    return (coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight);
  };

  var _pollImages = function () {
    for (var i = 0; i < store.length; i++) {
      var self = store[i];
      if (_inView(self)) {
        self.src = self.getAttribute('data-echo');
        if ([].indexOf && [].slice.call(store).indexOf(self) !== -1) {
          [].slice.call(store).splice(i, 1);
        }
      }
    }
  };

  var init = function () {
    store = document.querySelectorAll('[data-echo]');
    _pollImages();
    _addEventListener(window, 'scroll', _pollImages);
  };

  return {
    init: init
  };
  
  var _addEventListener = function(element, event, callback) {
    if (element.addEventListener) {
      _addEventListener = function(element, event, callback) {
        element.addEventListener(event, callback, false);
      };
    }
    else {
      _addEventListener = function(element, event, callback) {
        element.attachEvent('on' + event, callback);
      };
    }
    
    _addEventListener(element, event, callback);
  };

})(window, document);
