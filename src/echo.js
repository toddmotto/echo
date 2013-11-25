if (!document.querySelectorAll && document.createStyleSheet) {
  document.querySelectorAll = function (selector) {
    var all = document.all, result = [], style = document.createStyleSheet();
    style.addRule(selector, 'fake:fake');
    for (var i = all.length - 1; i >= 0; i--) {
      if (all[i].currentStyle.fake === 'fake') {
        result.push(all[i]);
      }
    }
    style.removeRule(0); return result;
  }
}

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
    window.onscroll = _pollImages;
  };

  return {
    init: init
  };

})(window, document);
