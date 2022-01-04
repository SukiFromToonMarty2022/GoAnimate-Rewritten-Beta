/* to get the comedy world character creator working, you need to get the code from this link: https://lvmprojects.herokuapp.com/goanimate-rewritten/code
for eve: https://lvmprojects.herokuapp.com/goanimate-rewritten/code?type=eve for rocky: https://lvmprojects.herokuapp.com/goanimate-rewritten/code?type=rocky for bob:
https://lvmprojects.herokuapp.com/goanimate-rewritten/code?type=bob if you want to change the theme, do 
https://lvmprojects.herokuapp.com/goanimate-rewritten/code?type=default&?theme=
and then put in the cc theme you would like to have. to apply the code to the cc,
right click somewhere on this page: https://lvmprojects.herokuapp.com/goanimate-rewritten/cc and then click inspect.
when there, go to the console and paste in the script and press the enter key.*/
const stuff = require('./info');
const fUtil = require('../fileUtil');

function toAttrString(table) {
	return typeof (table) == 'object' ? Object.keys(table).filter(key => table[key] !== null).map(key =>
		`${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`).join('&') : table.replace(/"/g, "\\\"");
}
function toParamString(table) {
	return Object.keys(table).map(key =>
		`<param name="${key}" value="${toAttrString(table[key])}">`
	).join(' ');
}
function toObjectString(attrs, params) {
	return `<object ${Object.keys(attrs).map(key =>
		`${key}="${attrs[key].replace(/"/g, "\\\"")}"`
	).join(' ')}>${toParamString(params)}</object>`;
}

module.exports = function (req, res, url) {
	if (req.method != 'GET') return;
	const query = url.query;

	var attrs, params, title, type, desc, stuff;
	switch (url.pathname) {
		case '/goanimate-rewritten/cc':
			title = 'Make a Character - GoAnimate Rewritten';
			desc = 'The Character Creator from GoAnimate - Create a character online with GoAnimate.';
			stuff = '<div><div id="char_creator_client" align="center"><object data="https://josephcrosmanplays532.github.io/animation/cce25167cb1d3404/cc.swf" type="application/x-shockwave-flash" id="char_creator" width="960" height="600"><param name="align" value="middle"><param name="allowScriptAccess" value="always"><param name="allowFullScreen" value="true"><param name="wmode" value="transparent"><param name="flashvars" value="apiserver=%2F&amp;m_mode=school&amp;isLogin=Y&amp;isEmbed=0&amp;ctc=go&amp;tlang=en_US&amp;storePath=https%3A%2F%2Fjosephcrosmanplays532.github.io%2FGoAnimate-2016-Assets%2Fstore%2F3a981f5cb2739137%2F%3Cstore%3E&amp;clientThemePath=https%3A%2F%2Fjosephcrosmanplays532.github.io%2Fstatic%2Fad44370a650793d9%2F%3Cclient_theme%3E&amp;appCode=go&amp;page=&amp;siteId=school&amp;userId=0yLqS9darTuA&amp;themeId=whiteboard&amp;ut=23&amp;ft=_sticky_filter_guy"><param name="movie" value="https://josephcrosmanplays532.github.io/animation/cce25167cb1d3404/cc.swf"></object></div></div><script>jQuery(\'#char_creator_client\').flash({ id: "char_creator", swf: "https://josephcrosmanplays532.github.io/animation/cce25167cb1d3404/cc.swf", height: 600, width: 960, align: "middle", allowScriptAccess: "always", allowFullScreen: "true", wmode: "transparent", hasVersion: "10.3", flashvars: {"apiserver":"https:\/\/goanimatewrapper-europe.herokuapp.com\/","m_mode":"school","isLogin":"Y","isEmbed":"0","ctc":"go","tlang":"en_US","storePath":"https:\/\/josephcrosmanplays532.github.io\/GoAnimate-2016-Assets\/store\/3a981f5cb2739137\/<store>","clientThemePath":"https:\/\/josephcrosmanplays532.github.io\/GoAnimate-2016-Assets\/static\/ad44370a650793d9\/<client_theme>","appCode":"go","page":"","siteId":"school","userId":"0yLqS9darTuA","themeId":"whiteboard","ut":23,"ft":"_sticky_filter_guy"}}); function goSubscribe() { var url = \'/business/videoplans?hook=cc.site\'; window.open(url, \'goSubscribe\'); } function characterSaved() { SetCookie(\'cc_saved\', \'1\', 1, \'/\'); window.location = \'/goanimate-rewritten/videomaker/\'; }</script>';
			type = 'cc';
			attrs = {
				data: process.env.SWF_URL + '/cc.swf', // data: 'cc.swf',
				type: 'application/x-shockwave-flash', id: 'char_creator', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'storePath': process.env.STORE_URL + '/<store>',
					'clientThemePath': process.env.CLIENT_URL + '/<client_theme>', 'original_asset_id': query['id'] || null,
					'themeId': 'business', 'ut': 60, 'bs': 'default', 'appCode': 'go', 'page': '', 'siteId': 'go',
					'm_mode': 'school', 'isLogin': 'Y', 'isEmbed': 1, 'ctc': 'go', 'tlang': 'en_US',
				},
				allowScriptAccess: 'always',
				movie: process.env.SWF_URL + '/cc.swf', // 'http://localhost/cc.swf'
			};
			break;

		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
	res.end(`<html lang="en"><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><link rel="dns-prefetch" href="//josephcrosmanplays532.github.io/"><title>${title}</title><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="${desc}"><meta property="og:site_name" content="GoAnimate for Schools"><meta property="fb:app_id" content="122508887813978"><meta name="google-site-verification" content="Vta3YTpj6Kx6u4p-EzeMArY0alNItkyUYYMvNM8seVI"><link rel="stylesheet" href="//fonts.googleapis.com/css?family=Lato:400,700"><link rel="stylesheet" href="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/css/common_combined.css.gz.css"><link rel="stylesheet" href="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/css/importer.css.gz.css"><link rel="stylesheet" href="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/css/${type}.css.gz.css"><script src="https://js.hs-scripts.com/491659.js" type="text/javascript" id="hs-script-loader"></script><script type="text/javascript" async="" src="https://koi-3q6b8sg59e.marketingautomation.services/client/ss.js?ver=1.1.1"></script><script id="hs-analytics" src="//js.hs-analytics.net/analytics/1517491800000/491659.js"></script><script type="text/javascript" async="" src="https://www.google-analytics.com/plugins/ua/ecommerce.js"></script><script async="" src="//www.google-analytics.com/analytics.js"></script><script>var srv_tz_os = -5, view_name = "school", user_cookie_name = "u_info_school"; var user_country = "CA"; </script><!--[if lt IE 9]><script src="https://d2qrjeyl4jwu9j.cloudfront.net/static/a58ff843b3f92207/go/js/lib/html5shiv.js.gz.js"></script><![endif]--><script src="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/js/common_combined.js.gz.js"></script><script type="text/javascript" src="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/po/goserver_js-en_US.json.gz.json"></script><script type="text/javascript">var I18N_LANG = 'en_US'; var GT = new Gettext({'locale_data': json_locale_data});</script><script src="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/js/movie.js.gz.js"></script><script src="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/js/cookie.js.gz.js"></script><script src="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/js/studio.js"></script><script src="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/js/jquery/jquery.tmpl.min.js.gz.js"></script><script src="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/js/studio.js.gz.js"></script><script type="text/javascript">(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){ (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-2516970-15', { 'userId': '0VLx9lDwEqAA' }); ga('send', 'pageview'); ga('require', 'ecommerce'); $(function() { var COOKIE_LAST_URL_LIFETIME = 5, COOKIE_BLOCKER_LIFETIME = 900; function setSessionCookie(cookie_name, cookie_value, lifetime) { document.cookie = cookie_name + '=' + escape(cookie_value) + '; path=/; max-age=' + lifetime + ';'; } function getSessionCookie(cookie_name) { var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)'); if (results) { return (unescape(results[2])); } else { return null; } } $(window).on({ unload: function() { setSessionCookie('lasturl', window.location.href, COOKIE_LAST_URL_LIFETIME); }, onbeforeunload: function() { setSessionCookie('lasturl', window.location.href, COOKIE_LAST_URL_LIFETIME); }, load: function() { var http_referrer = document.referrer, blocker = getSessionCookie('gasessid'); if (http_referrer === '') { http_referrer = getSessionCookie('lasturl'); } if ((http_referrer === '') || (blocker === null)) { if (typeof(ga) !== 'undefined') { var currentDate = new Date(), sessionId, clientId; // Assume we only have one tracker try { var trackers = ga.getAll(); var currentDate = new Date(), clientId = trackers[0].get('clientId'), sessionId = clientId + '.' + currentDate.getTime(); // Set custom dimension (UniqueID). ga('set', 'dimension1', clientId); // Set custom dimension (Session ID). ga('set', 'dimension2', sessionId); // Set blocker. setSessionCookie('gasessid', sessionId, COOKIE_BLOCKER_LIFETIME); } catch(e) {} } } } }); }); </script> <!-- Google Knowledge Graph --> <script type="application/ld+json"> { "@context": "https://web.archive.org/web/20180207180629/http://schema.org", "@type": "Organization", "name": "GoAnimate", "url": "https://web.archive.org/web/20180207180629/http://goanimate.com", "logo": "https://web.archive.org/web/20180207180629/http://gawpstorage.s3.amazonaws.com/img/google_knowledge_graph_logo.jpg", "sameAs": [ "https://web.archive.org/web/20180207180629/http://www.facebook.com/GoAnimateInc", "https://web.archive.org/web/20180207180629/http://twitter.com/GoAnimate", "https://web.archive.org/web/20180207180629/http://www.linkedin.com/company/goanimate", "https://web.archive.org/web/20180207180629/http://plus.google.com/+goanimate", "https://web.archive.org/web/20180207180629/http://www.youtube.com/user/GoAnimate" ] }</script></head><body><script type="text/javascript"> if (self !== top) { jQuery('body').hide(); }</script><link href="//fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">${stuff}</body></html>`);
	return true;
}
