if (!document.querySelectorAll && document.createStyleSheet) {
  document.querySelectorAll = function (selector) {
    var all = document.all, result = [], style = document.createStyleSheet();
    style.addRule(selector, 'fake:fake');
    for (var i = all.length - 1; i >= 0; i--) {
      if (all[i].currentStyle.fake === 'fake') {
        result.push(all[i]);
      }
    }
    style.removeRule(0); return result;
  }
}