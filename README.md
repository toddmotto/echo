# Echo [![Build Status](https://travis-ci.org/toddmotto/echo.png)](https://travis-ci.org/toddmotto/echo)

Echo is a standalone JavaScript lazy-loading image tool. Echo is fast, less than 1KB and uses HTML5 data-* attributes. Check out a [demo](http://toddmotto.com/labs/echo). Echo works in IE8+.

```
bower install echojs
```

Using Echo.js is simple, just add the image you wish to load to a `data-echo`  attribute.

```html
<body>

  <img src="img/blank.gif" alt="Photo" data-echo="img/photo.jpg">

  <script src="dist/echo.js"></script>
  <script>
  Echo.init({
    offset: 100,
    throttle: 250,
    unload: false,
    callback: function(element, op){ console.log(element, "has been", op+'ed')}
  });

  // Echo.render(); is also available for non-scroll callbacks
  </script>
</body>
```

## .init() API (options)

The `init()` API takes a few options

#### offset
Type: `Number|String` Default: `0`

The `offset` option allows you to specify how far below, above, to the left, and to the right of the viewport you want Echo to _begin_ loading your images. If you specify `0`, Echo will load your image as soon as it is visible in the viewport, if you want to load _1000px_ below or above the viewport, use `1000`.

#### offsetVertical
Type: `Number|String` Default: `offset`'s value

The `offsetVertical` option allows you to specify how far above and below the viewport you want Echo to _begin_ loading your images.

#### offsetHorizontal
Type: `Number|String` Default: `offset`'s value

The `offsetHorizontal` option allows you to specify how far to the left and right of the viewport you want Echo to _begin_ loading your images.

#### offsetTop
Type: `Number|String` Default: `offsetVertical`'s value

The `offsetTop` option allows you to specify how far above the viewport you want Echo to _begin_ loading your images.

#### offsetBottom
Type: `Number|String` Default: `offsetVertical`'s value

The `offsetBottom` option allows you to specify how far below the viewport you want Echo to _begin_ loading your images.

#### offsetLeft
Type: `Number|String` Default: `offsetVertical`'s value

The `offsetLeft` option allows you to specify how far to left of the viewport you want Echo to _begin_ loading your images.

#### offsetRight
Type: `Number|String` Default: `offsetVertical`'s value

The `offsetRight` option allows you to specify how far to the right of the viewport you want Echo to _begin_ loading your images.

#### throttle
Type: `Number|String` Default: `250`

The throttle is managed by an internal function that prevents performance issues from continuous firing of `window.onscroll` events. Using a throttle will set a small timeout when the user scrolls and will keep throttling until the user stops. The default is `250` milliseconds.

#### unload
Type: `Boolean` Default: `false`

This option will tell echo to unload loaded images once they have scrolled beyond the viewport (including the offset area).
This option requires the `placeholder` option also be set.

#### callback
Type: `Function`

The callback will be passed the element that has been updated and what the update operation was (ie `load` or `unload`). This can be useful if you want to add a class like `loaded` to the element. Or do some logging.

```js
Echo.init({
  callback: function(element, op) {
    if(op === 'load') {
      elemend.classList.add('loaded');
    } else {
      elemend.classList.remove('loaded');
    }
  }
});
```


## .render() API

Echo's callback `render()` can be used to make Echo poll your images when you're not scrolling, for instance if you've got a filter layout that swaps images but does not scroll, you need to call the internal functions without scrolling. Use `render()` for this:

```js
Echo.render();
```

Using `render()` is also throttled, which means you can bind it to a `window.onresize` event and it will be optimised for performance in the same way `window.onscroll` is.

## Manual installation
Drop your files into your required folders, make sure you're using the file(s) from the `dist` folder, which is the compiled production-ready code. Ensure you place the script before the closing `</body>` tag so the DOM tree is populated when the script runs.

## Configuring Echo
Add the image that needs to load when it's visible inside the viewport in a `data-echo` attribute:

```html
<img src="img/blank.gif" alt="Photo" data-echo="img/photo.jpg">
```

## Scaffolding
Project files and folder structure.

```
├── dist/
│   ├── echo.js
│   └── echo.min.js
├── src/
│   └── echo.js
├── .editorconfig
├── .gitignore
├── .jshintrc
├── .travis.yml
├── Gruntfile.js
└── package.json
```

## License
MIT license
