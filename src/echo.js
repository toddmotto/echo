window.Echo = (function (global, document, undefined) {

  'use strict';

  /**
   * store
   * @type {Array}
   */
  var store = [];

  /**
   * offset, throttle, poll vars
   */
  var offset, throttle, poll;

  /**
   *  _inView
   * @private
   * @param {Element} element Image element
   * @returns {Boolean} Is element in viewport
   */
  var _inView = function (element) {
    var coords = element.getBoundingClientRect();
    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + offset);
  };

  /**
   * _pollImages Loop through the images if present
   * or remove all event listeners
   * @private
   */
  var _pollImages = function () {
    var length = store.length;
    if (length > 0) {
      for (var i = 0; i < length; i++) {
        var self = store[i];
        if (self && _inView(self)) {
          self.src = self.getAttribute('data-echo');
          store.splice(i, 1);
          length = store.length;
          i--;
        }
      }
    } else {
      if (document.removeEventListener) {
        global.removeEventListener('scroll', _throttle);
      } else {
        global.detachEvent('onscroll', _throttle);
      }
      clearTimeout(poll);
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
   * @param {Object} [obj] Passed in Object with options
   * @param {Number|String} [obj.throttle]
   * @param {Number|String} [obj.offset]
   */
  var init = function (obj) {

    var nodes = document.querySelectorAll('[data-echo]');
    var opts = obj || {};
    offset = parseInt(opts.offset || 0);
    throttle = parseInt(opts.throttle || 250);

    for (var i = 0; i < nodes.length; i++) {
      store.push(nodes[i]);
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
   * return Public methods
   * @returns {Object}
   */
  return {
    init: init,
    render: _pollImages
  };

})(this, document);
