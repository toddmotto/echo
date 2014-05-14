window.Echo = (function (global, document, undefined) {

  'use strict';

  /**
   * callback - initialized to a no-op so that no validations on it's presence need to be made
   * @type {Function}
   */
  var callback = function(){};

  /**
   * offset, throttle, poll, unload vars
   */
  var offset, throttle, poll, unload;

  /**
   *  _inView
   * @private
   * @param {Element} element Image element
   * @returns {Boolean} Is element in viewport
   */
  var _inView = function (element, view) {
    var box = element.getBoundingClientRect();
    return (box.right >= view.l && box.bottom >= view.t && box.left <= view.r && box.top <= view.b);
  };

  /**
   * _pollImages Loop through the images if present
   * or remove all event listeners
   * @private
   */
  var _pollImages = function () {
    var src,
        i,
        elem,
        view,
        nodes = document.querySelectorAll('img[data-echo]'),
        length = nodes.length;
    view = {
      l: 0 - offset.l,
      t: 0 - offset.t,
      b: (window.innerHeight || document.documentElement.clientHeight) + offset.b,
      r: (window.innerWidth || document.documentElement.clientWidth) + offset.r
    };
    for(i=0; i<length; i++) {
      elem = nodes[i];
      if(_inView(elem, view)) {
        if(unload) {
          elem.setAttribute('data-echo-placeholder', elem.src);
        }
        elem.src = elem.getAttribute('data-echo');
        if(!unload) {
          elem.removeAttribute('data-echo');
        }
        callback(elem, 'load');
      } else if(unload && !!(src = elem.getAttribute('data-echo-placeholder'))) {
        elem.src = src;
        elem.removeAttribute('data-echo-placeholder');
        callback(elem, 'unload');
      }
    }
    if(!length) {
      detach();
    }
  };

  /**
   * _throttle Sensible event firing
   * @private
   */
  var _throttle = function () {
    clearTimeout(poll);
    poll = setTimeout(_pollImages, throttle);
  };

  /**
   * init Module init function
   * @param {Object} [opts] Passed in Object with options
   * @param {Number|String} [opts.throttle]
   * @param {Number|String} [opts.offset]
   * @param {Number|String} [opts.offsetBottom]
   * @param {Number|String} [opts.offsetTop]
   * @param {Number|String} [opts.offsetLeft]
   * @param {Number|String} [opts.offsetRight]
   * @param {Boolean} [opts.unload]
   * @param {Function} [opts.callback]
   */
  var init = function (opts) {

    opts = opts || {};
    var offsetAll = opts.offset || 0;
    var offsetVertical = opts.offsetVertical || offsetAll;
    var offsetHorizontal = opts.offsetHorizontal || offsetAll;

    function optionToInt(opt, fallback) {
      return parseInt(opt || fallback, 10);
    }

    offset = {
      t: optionToInt(opts.offsetTop, offsetVertical),
      b: optionToInt(opts.offsetBottom, offsetVertical),
      l: optionToInt(opts.offsetLeft, offsetHorizontal),
      r: optionToInt(opts.offsetRight, offsetHorizontal)
    };
    throttle = optionToInt(opts.throttle, 250);
    unload = !!opts.unload;
    callback = opts.callback || callback;


    _pollImages();

    if (document.addEventListener) {
      global.addEventListener('scroll', _throttle, false);
      global.addEventListener('load', _throttle, false);
    } else {
      global.attachEvent('onscroll', _throttle);
      global.attachEvent('onload', _throttle);
    }

  };

  /**
   * detach remove listeners
   */
  var detach = function() {
    if (document.removeEventListener) {
      global.removeEventListener('scroll', _throttle);
    } else {
      global.detachEvent('onscroll', _throttle);
    }
    clearTimeout(poll);
  };

  /**
   * return Public methods
   * @returns {Object}
   */
  return {
    init: init,
    detach: detach,
    render: _pollImages
  };

})(this, document);
