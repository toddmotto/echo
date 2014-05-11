window.Echo = (function (global, document, undefined) {

  'use strict';

  /**
   * toBeLoaded
   * @type {Array}
   */
  var toBeLoaded = [];

  /**
   * toBeUnloaded
   * @type {Array}
   */
  var toBeUnloaded = [];

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
    var loadingLength = toBeLoaded.length,
        unloadingLength,
        i,
        self,
        view;
    view = {
      l: 0 - offset.l,
      t: 0 - offset.t,
      b: (window.innerHeight || document.documentElement.clientHeight) + offset.b,
      r: (window.innerWidth || document.documentElement.clientWidth) + offset.r
    };
    if (loadingLength > 0) {
      for (i = 0; i < loadingLength; i++) {
        self = toBeLoaded[i];
        if (self && _inView(self, view)) {
          if(unload) {
            self.setAttribute('data-echo-placeholder', self.src);
            toBeUnloaded.push(self);
          }
          self.src = self.getAttribute('data-echo');
          callback(self, 'load');
          toBeLoaded.splice(i, 1);
          loadingLength = toBeLoaded.length;
          i--;
        }
      }
    }
    unloadingLength = toBeUnloaded.length;
    if (unloadingLength > 0) {
      for(i = 0; i < unloadingLength; i++) {
        self = toBeUnloaded[i];
        if (self && !_inView(self, view)) {
          self.src = self.getAttribute('data-echo-placeholder');
          callback(self, 'unload');
          toBeUnloaded.splice(i, 1);
          unloadingLength = toBeUnloaded.length;
          i--;
          toBeLoaded.push(self);
        }
      }
    }
    if(unloadingLength === 0 && loadingLength === 0) {
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
   * @param {Number|String} [opts.offsetBot]
   * @param {Number|String} [opts.offsetTop]
   * @param {Number|String} [opts.offsetLeft]
   * @param {Number|String} [opts.offsetRight]
   * @param {Boolean} [opts.unload]
   * @param {Function} [opts.callback]
   */
  var init = function (opts) {

    var nodes = document.querySelectorAll('img[data-echo]');
    opts = opts || {};
    var offsetAll = opts.offset || 0;
    var offsetVertical = opts.offsetVertical || offsetAll;
    var offsetHorizontal = opts.offsetHorizontal || offsetAll;

    function optionToInt(opt, fallback) {
      return parseInt(opt || fallback, 10);
    }

    offset = {
      t: optionToInt(opts.offsetBot, offsetVertical),
      b: optionToInt(opts.offsetTop, offsetVertical),
      l: optionToInt(opts.offsetLeft, offsetHorizontal),
      r: optionToInt(opts.offsetRight, offsetHorizontal)
    };
    throttle = optionToInt(opts.throttle, 250);
    unload = !!opts.unload;
    callback = opts.callback || callback;

    toBeLoaded = [];
    toBeUnloaded = [];

    for (var i = 0; i < nodes.length; i++) {
      toBeLoaded.push(nodes[i]);
    }

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
