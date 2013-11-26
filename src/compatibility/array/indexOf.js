if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (element , start) {
    var start = start ? start : 0, length;
    if (!this) {
      throw new TypeError();
    }
    length = this.length;
    if (length === 0 || start >= length) {
      return -1;
    }
    if (start < 0) {
      start = length - Math.abs(start);
    }
    for (var i = start; i < length; i++) {
      if (this[i] === element) {
        return i;
      }
    }
    return -1;
  };
}