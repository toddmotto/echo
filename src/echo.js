window.Echo = (function (window, document, undefined) {

  'use strict';

  var store = [];

  var _inView = function (img) {
    var coords = img.getBoundingClientRect();
    return (coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight);
  };

  var _pollImages = function () {
    for (var i = store.length; i--; ) {
      if (_inView(store[i])) {
        store[i].src = store[i].getAttribute('data-echo');
        store.splice(i, 1);
      }
    }
  };

  var init = function () {
    var nodes = document.querySelectorAll('[data-echo]');
    for (var i = nodes.length; i--; store.unshift(nodes[i]));

    _pollImages();
    window.onscroll = _pollImages;
  };

  return {
    init: init
  };

})(window, document);
