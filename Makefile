define colorecho
      @tput setaf 6
      @echo "\n### $1 ###\n"
      @tput sgr0
endef

all: js

clean:
	$(call colorecho, "Cleaning ignored files")
	cat .gitignore | xargs rm -rf

npm:
	$(call colorecho, "Installing npm dependencies")
	npm install

lint: npm
	$(call colorecho, "Linting JavaScript")
	node_modules/.bin/jshint src/sloth.js -c .jshintrc --reporter node_modules/jshint-stylish/stylish.js

js: lint
	$(call colorecho, "Minifying JavaScript")
	mkdir -p dist
	node_modules/.bin/uglifyjs src/sloth.js --compress --mangle > dist/sloth.min.js
	wc -c dist/sloth.min.js

