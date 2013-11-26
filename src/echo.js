window.Echo = (function (window, document, undefined) {

  'use strict';

  var store;

  var _inView = function (img) {
    var coords = img.getBoundingClientRect();
    return (coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight);
  };

  var _pollImages = function () {
    for (var i = 0, len = store.length; i < len; i++) {
      var self = store[i];
      if (_inView(self)) {
        self.src = self.getAttribute('data-echo');
        store.splice(i, 1);
      }
    }
  };

  var init = function () {
    store = document.querySelectorAll('[data-echo]');
    store = [].slice.call(store);
    _pollImages();
    window.onscroll = _pollImages;
  };

  return {
    init: init
  };

})(window, document);
