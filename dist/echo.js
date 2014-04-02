/*! Echo v1.5.0 | (c) 2014 @toddmotto | MIT license | github.com/toddmotto/echo */
window.Echo = (function (global, document, undefined) {

  'use strict';

  /**
   * store
   * @type {Array}
   */
  var store = [];

  /**
   * callback - initialized to a no-op so that no validations on it's presence need to be made
   * @type {Function}
   */
  var callback = function(){};

  /**
   * offset, throttle, poll, vars
   */
  var offset, throttle, poll;

  /**
   * _contains
   * @private
   * @param {Node} parent Parent node
   * @param {Node} descendant Descendant node
   * @returns {Boolean} Does parent contain descendant
   */
  var _contains = !!document.compareDocumentPosition ?
  // IE
  function (parent, descendant) {
    return parent.contains(descendant);
  } :
  // Everyone else
  function (parent, descendant) {
    /*jslint bitwise: true */
    return parent.compareDocumentPosition(descendant) & 16;
    /*jslint bitwise: false */
  };

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
        if (self && _contains(document.documentElement, self) && _inView(self)) {
          self.src = self.getAttribute('data-echo');
          callback(self);
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
   * @param {Function} [obj.callback]
   */
  var init = function (obj) {

    var nodes = document.querySelectorAll('[data-echo]');
    var opts = obj || {};
    offset = parseInt(opts.offset || 0);
    throttle = parseInt(opts.throttle || 250);
    callback = opts.callback || callback;

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
