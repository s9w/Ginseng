all: ginseng.js

ginseng.js: jsx/app_browser.js jsx/app_infos.js jsx/app_types.js jsx/app_intervaller.js jsx/app_reviewdisplay.js jsx/app_review.js jsx/TemplateDetails.js  jsx/script_app.js Makefile
	jsx --harmony jsx js
	uglifyjs js/app_browser.js js/app_infos.js js/app_types.js js/app_intervaller.js js/app_reviewdisplay.js js/app_review.js js/TemplateDetails.js  js/script_app.js -o ginseng.js

compress:
	jsx --harmony jsx js
	uglifyjs js/app_browser.js js/app_infos.js js/app_types.js js/app_intervaller.js js/app_reviewdisplay.js js/app_review.js js/TemplateDetails.js  js/script_app.js  --compress --screw-ie8 --mangle sort -o ginseng.js