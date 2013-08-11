/*!
 *  Echo
 *  @version 1.0.0
 *  @author Todd Motto http://toddmotto.com
 *  Project: https://github.com/toddmotto/echo
 *
 *  Raw JavaScript lazy-loading images with HTML5 data-* attributes.
 *  Copyright 2013. MIT licensed.
 */
window.echo = (function (window, document) {

  'use strict';

  /*
   * Constructor function
   */
  var Echo = function (elem) {
    this.elem = elem;
    this.render();
    this.listen();
  };

  /*
   * Images for echoing
   */
  var echoStore = [];
  
  /*
   * Element in viewport logic
   */
  var scrolledIntoView = function (element) {
    var coords = element.getBoundingClientRect();
    return ((coords.top >= 0 && coords.left >= 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight));
  };

  /*
   * Changing src attr logic
   */
  var echoSrc = function (img, callback) {
    img.src = img.getAttribute('data-echo');
    if (callback) {
      callback();
    }
  };

  /*
   * Remove loaded item from array
   */
  var removeEcho = function (element, index) {
    if (echoStore.indexOf(element) !== -1) {
      echoStore.splice(index, 1);
    }
  };

  /*
   * Echo the images and callbacks
   */
  var echoImages = function () {
    for (var i = 0; i < echoStore.length; i++) {
      var self = echoStore[i];
      if (scrolledIntoView(self)) {
        echoSrc(self, removeEcho(self, i));
      }
    }
  };

  /*
   * Prototypal setup
   */
  Echo.prototype = {
    init : function () {
      echoStore.push(this.elem);
    },
    render : function () {
      if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', echoImages, false);
      } else {
        window.onload = echoImages;
      }
    },
    listen : function () {
      window.onscroll = echoImages;
    }
  };

  /*
   * Initiate the plugin
   */
  var lazyImgs = document.querySelectorAll('img[data-echo]');
  for (var i = 0; i < lazyImgs.length; i++) {
    new Echo(lazyImgs[i]).init();
  }

})(window, document);