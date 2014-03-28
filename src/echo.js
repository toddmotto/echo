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
   * offsetBot, offsetTop throttle, poll, unload vars
   */
  var offsetBot, offsetTop,  throttle, poll, unload;

  /**
   *  _inView
   * @private
   * @param {Element} element Image element
   * @returns {Boolean} Is element in viewport
   */
  var _inView = function (element) {
    var coords = element.getBoundingClientRect();
    var topInView = coords.top >= 0 && coords.left >= 0 && coords.top <= (window.innerHeight || document.documentElement.clientHeight) + offsetBot && coords.top >= -1 * offsetTop;
    var botInView = coords.bottom >= -1 * offsetTop && coords.left >= 0 && coords.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offsetBot;
    return topInView || botInView;
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
        self;
    if (loadingLength > 0) {
      for (i = 0; i < loadingLength; i++) {
        self = toBeLoaded[i];
        if (self && _inView(self)) {
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
        if (self && !_inView(self)) {
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
   * @param {Object} [obj] Passed in Object with options
   * @param {Number|String} [obj.throttle]
   * @param {Number|String} [obj.offset]
   * @param {Number|String} [obj.offsetBot]
   * @param {Number|String} [obj.offsetTop]
   * @param {Boolean} [obj.unload]
   * @param {Function} [obj.callback]
   */
  var init = function (obj) {

    var nodes = document.querySelectorAll('[data-echo]');
    var opts = obj || {};
    var offset = parseInt(opts.offset || 0);
    offsetBot = parseInt(opts.offsetBot || offset);
    offsetTop = parseInt(opts.offsetTop || offset);
    throttle = parseInt(opts.throttle || 250);
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
