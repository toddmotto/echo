window.Echo = (function (window, document, undefined) {

  'use strict';

  var store = [], offset, throttle, poll, domElement;

  var _inView = function (el) {
    var coords = el.getBoundingClientRect();
    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset));
  };

  var _pollImages = function () {
    for (var i = store.length; i--;) {
      var self = store[i];
      if (_inView(self)) {
        self.src = self.getAttribute('data-echo');
        store.splice(i, 1);
      }
    }
  };

  var _throttle = function () {
    clearTimeout(poll);
    poll = setTimeout(_pollImages, throttle);
  };

  var init = function (obj) {
    
    var opts = obj || {};
    offset = opts.offset || 0;
    throttle = opts.throttle || 250;
    domElement = opts.domElement ? document.querySelector(opts.domElement) : window;
    var nodes = document.querySelectorAll( (opts.domElement || "") + ' [data-echo]');

    for (var i = 0; i < nodes.length; i++) {
      store.push(nodes[i]);
    }

    _throttle();

    if (document.addEventListener) {
      domElement.addEventListener('scroll', _throttle, false);
    } else {
      domElement.attachEvent('onscroll', _throttle);
    }
  };

  return {
    init: init,
    render: _throttle
  };

})(window, document);
