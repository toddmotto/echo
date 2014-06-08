/*! echo.js v1.6.0 | (c) 2014 @toddmotto | https://github.com/echo */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory;
  } else {
    root.echo = factory(root);
  }
})(this, function (root) {

  'use strict';

  var echo = {};

  var callback = function () {};

  var offset, poll, throttle, unload;

  var inView = function (element, view) {
    var box = element.getBoundingClientRect();
    return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
  };

  var debounce = function () {
    clearTimeout(poll);
    poll = setTimeout(echo.render, throttle);
  };

  echo.init = function (opts) {
      opts = opts || {};
    var offsetAll = opts.offset || 0;
    var offsetVertical = opts.offsetVertical || offsetAll;
    var offsetHorizontal = opts.offsetHorizontal || offsetAll;
    var optionToInt = function (opt, fallback) {
      return parseInt(opt || fallback, 10);
    };
    offset = {
      t: optionToInt(opts.offsetTop, offsetVertical),
      b: optionToInt(opts.offsetBottom, offsetVertical),
      l: optionToInt(opts.offsetLeft, offsetHorizontal),
      r: optionToInt(opts.offsetRight, offsetHorizontal)
    };
    throttle = optionToInt(opts.throttle, 250);
    unload = !!opts.unload;
    callback = opts.callback || callback;
    echo.render();
    if (document.addEventListener) {
      root.addEventListener('scroll', debounce, false);
      root.addEventListener('load', debounce, false);
    } else {
      root.attachEvent('onscroll', debounce);
      root.attachEvent('onload', debounce);
    }
  };

  echo.render = function () {
    var nodes = document.querySelectorAll('img[data-echo]');
    var length = nodes.length;
    var src, elem;
    var view = {
      l: 0 - offset.l,
      t: 0 - offset.t,
      b: (root.innerHeight || document.documentElement.clientHeight) + offset.b,
      r: (root.innerWidth || document.documentElement.clientWidth) + offset.r
    };
    for (var i = 0; i < length; i++) {
      elem = nodes[i];
      if (inView(elem, view)) {
        if (unload) {
          elem.setAttribute('data-echo-placeholder', elem.src);
        }
        elem.src = elem.getAttribute('data-echo');
        if (!unload) {
          elem.removeAttribute('data-echo');
        }
        callback(elem, 'load');
      } else if (unload && !!(src = elem.getAttribute('data-echo-placeholder'))) {
        elem.src = src;
        elem.removeAttribute('data-echo-placeholder');
        callback(elem, 'unload');
      }
    }
    if (!length) {
      echo.detach();
    }
  };

  echo.detach = function () {
    if (document.removeEventListener) {
      root.removeEventListener('scroll', debounce);
    } else {
      root.detachEvent('onscroll', debounce);
    }
    clearTimeout(poll);
  };

  return echo;

});
