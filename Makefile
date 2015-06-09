all: js/ginseng.min.js

js/ginseng.min.js: js/ginseng.js
	uglifyjs js/ginseng.js --compress --screw-ie8 --mangle -o js/ginseng.min.js

js/ginseng.js: jsx/* Makefile
	browserify jsx/Ginseng.jsx -t babelify --outfile js/ginseng.js