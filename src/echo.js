window.Echo = (function (window, document, undefined) {

  'use strict';

  var store;

  var _inView = function (img) {
    var coords = img.getBoundingClientRect();
    return (coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight);
  };
  
  var _getStyle = function(el, prop) {
    return window.getComputedStyle ? window.getComputedStyle(el, null).getPropertyValue(prop) : el.currentStyle[prop];
  };

  var _pollImages = function () {
    for (var i = 0; i < store.length; i++) {
      var self = store[i];
      if (_inView(self) && (_getStyle(self, 'display') !== 'none' && _getStyle(self.parentNode, 'display') !== 'none')) {
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
    window.onscroll = _pollImages;
  };

  return {
    init: init
  };

})(window, document);
