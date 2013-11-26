# Echo [![Build Status](https://travis-ci.org/toddmotto/echo.png)](https://travis-ci.org/toddmotto/echo)

Echo is a standalone JavaScript lazy-loading image tool. Echo is fast, less than 1KB and uses HTML5 data-* attributes.

```html
<img src="img/blank.gif" alt="Photo" data-echo="img/photo.jpg">
```

## Demo
Check out a [demo of Echo](http://toddmotto.com/labs/echo).

## Installing with Bower
To install Echo into your project using Bower, use the GitHub repository hook:

```
bower install https://github.com/toddmotto/echo.git
```

## Manual installation
Drop your files into your required folders, make sure you're using the file(s) from the `dist` folder, which is the compiled production-ready code. Ensure you place the script before the closing `</body>` tag so the DOM tree is populated when the script runs.
	
```html
<body>
	<!-- html content above -->
	<script src="dist/echo.js"></script>
  <script>
  // call Echo.js
  Echo.init();
  </script>
</body>
```

## Configuring Echo
Add the image that needs to load when visible in a `data-echo` attribute:

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
│   ├──	compatibility/
│   │   ├──	array/
│   │   │	└──	indexOf.js
│   │   └──	document/
│   │      └── querySelectorAll.js
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
