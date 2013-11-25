// support Array.indexOf for IE8 : https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement , fromIndex) {
    var i,
        pivot = (fromIndex) ? fromIndex : 0,
        length;

    if (!this) {
      throw new TypeError();
    }

    length = this.length;

    if (length === 0 || pivot >= length) {
      return -1;
    }

    if (pivot < 0) {
      pivot = length - Math.abs(pivot);
    }

    for (i = pivot; i < length; i++) {
      if (this[i] === searchElement) {
        return i;
      }
    }
    return -1;
  };
}


window.Echo = (function (window, document, undefined) {

  'use strict';

  var store;
  
  var _windowHeight = function() {
    return window.innerHeight || document.documentElement.clientHeight;
  }

  var _inView = function (img) {
    var coords = img.getBoundingClientRect();
    return (coords.top >= 0 && coords.left >= 0 && coords.top) <= _windowHeight();
  };
  

  var _pollImages = function () {
    for (var i = 0; i < store.length; i++) {
      var self = store[i];
      if (_inView(self)) {
        self.src = self.getAttribute('data-echo');
        if (store.indexOf(self) !== -1) {
          store.splice(i, 1);
        }
      }
    }
  };

  var init = function () {
    store = document.querySelectorAll('[data-echo]');
    _pollImages();
    window.onscroll = _pollImages;
  };

  return {
    init: init
  };

})(window, document);
