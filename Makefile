all: ginseng.js

ginseng.js: jsx/app_browser.js jsx/app_infos.js jsx/app_types.js jsx/app_intervaller.js jsx/app_review.js jsx/app_views.js jsx/script_app.js Makefile
	jsx jsx js
	uglifyjs js/app_browser.js js/app_infos.js js/app_types.js js/app_intervaller.js js/app_review.js js/app_views.js js/script_app.js -o ginseng.js