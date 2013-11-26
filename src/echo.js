window.Echo = (function (window, document, undefined) {

  'use strict';

  var store;

  var _inView = function (img) {
    var coords = img.getBoundingClientRect();
    return (coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight);
  };

  var _pollImages = function () {
    var imgs = store.slice();
    for (var i = 0, len = imgs.length; i < len; i++) {
      var self = imgs[i];
      if (_inView(self)) {
        self.src = self.getAttribute('data-echo');
        store.splice(i, 1);
      }
    }
  };
  
  var toArray (obj) {
    var arr = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      arr.push(obj[i]);
    }
    return arr;
  }
  
  var init = function () {
    store = document.querySelectorAll('[data-echo]');
    store = toArray(store);
    _pollImages();
    window.onscroll = _pollImages;
  };

  return {
    init: init
  };

})(window, document);
