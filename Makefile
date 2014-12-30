JS_FILES := $(wildcard jsx/*.js)

all: ginseng.js

ginseng.js: $(JS_FILES) Makefile
	6to5 jsx --out-file ginseng.js

compress:
	uglifyjs ginseng.js  --compress --screw-ie8 --mangle sort -o ginseng.min.js