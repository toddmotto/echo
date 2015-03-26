(function (window) {
  'use strict';

  var DATA_SRC = 'data-src';
  var DATA_SRC_BG = 'data-src-bg';
  var DATA_PLACEHOLDER = 'data-sloth';

  var callback;
  var offset;
  var poll;
  var delay;
  var useDebounce;
  var unload;

  var inView = function (element, view) {
    if (element.offsetParent === null) {
      return false;
    }

    var box = element.getBoundingClientRect();
    return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
  };

  var debounceOrThrottle = function () {
    if (!useDebounce && !!poll) {
      return;
    }
    clearTimeout(poll);
    poll = setTimeout(function () {
      render();
      poll = null;
    }, delay);
  };

  var addListener = function(type, listener) {
    if (document.addEventListener) {
      window.addEventListener(type, listener);
    } else {
      window.attachEvent('on' + type, listener);
    }
  };

  var removeListener = function(type, listener) {
    if (document.removeEventListener) {
      window.removeEventListener(type, listener);
    } else {
      window.detachEvent(type, listener);
    }
  };

  var render = function () {
    var nodes = document.querySelectorAll('img[' + DATA_SRC + '], [' + DATA_SRC_BG + ']');
    var length = nodes.length;

    if (!length) {
      detach();
      return;
    }

    var src;
    var elem;
    var view = {
      l: 0 - offset.l,
      t: 0 - offset.t,
      b: (window.innerHeight || document.documentElement.clientHeight) + offset.b,
      r: (window.innerWidth || document.documentElement.clientWidth) + offset.r
    };

    for (var i = 0; i < length; i++) {
      elem = nodes[i];

      if (inView(elem, view)) {

        if (unload) {
          elem.setAttribute(DATA_PLACEHOLDER, elem.src);
        }

        if (elem.getAttribute(DATA_SRC_BG) !== null) {
          elem.style.backgroundImage = 'url(' + elem.getAttribute(DATA_SRC_BG) + ')';
        } else {
          elem.src = elem.getAttribute(DATA_SRC);
        }

        if (!unload) {
          elem.removeAttribute(DATA_SRC);
          elem.removeAttribute(DATA_SRC_BG);
        }

        callback(elem, 'load');
      } else if (unload && !!(src = elem.getAttribute(DATA_PLACEHOLDER))) {

        if (elem.getAttribute(DATA_SRC_BG) !== null) {
          elem.style.backgroundImage = 'url(' + src + ')';
        } else {
          elem.src = src;
        }

        elem.removeAttribute(DATA_PLACEHOLDER);
        callback(elem, 'unload');
      }
    }
  };

  var detach = function () {
    removeListener('scroll', debounceOrThrottle);
    removeListener('resize', debounceOrThrottle);

    clearTimeout(poll);
  };

  var optionToInt = function (opt, fallback) {
    return parseInt(opt || fallback, 10);
  };

  var sloth = {
    init: function (opts) {
      opts = opts || {};
      var offsetAll = opts.offset || 0;
      var offsetVertical = opts.offsetVertical || offsetAll;
      var offsetHorizontal = opts.offsetHorizontal || offsetAll;

      offset = {
        t: optionToInt(opts.offsetTop, offsetVertical),
        b: optionToInt(opts.offsetBottom, offsetVertical),
        l: optionToInt(opts.offsetLeft, offsetHorizontal),
        r: optionToInt(opts.offsetRight, offsetHorizontal)
      };
      delay = optionToInt(opts.throttle, 250);
      useDebounce = opts.debounce !== false;
      unload = !!opts.unload;
      callback = opts.callback || function() {};

      render();

      addListener('scroll', debounceOrThrottle);
      addListener('load', debounceOrThrottle);
      addListener('resize', debounceOrThrottle);
    },

    render: function() {
      render();
    },

    detach: function() {
      detach();
    }
  };

  if (typeof exports === 'object') {
    module.exports = sloth;
  } else {
    window.sloth = sloth;
  }
})(window);
