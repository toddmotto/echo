window.Echo = (function (window, document, undefined) {

  'use strict';

  var store;

  var _inView = function (img) {
    var coords = img.getBoundingClientRect(),
      height = window.innerHeight || document.documentElement.clientHeight;
    return (coords.top >= 0 && coords.left >= 0 && coords.top) <= height;
  };

  var _pollImages = function () {
    for (var i = 0; i < store.length; i++) {
      var self = store[i], array = Array.prototype;
      if (_inView(self)) {
        self.src = self.getAttribute('data-echo');
        if (array.indexOf.call(store, self) !== -1) {
          array.splice.call(store, i, 1);
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
