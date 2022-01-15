const fUtil = require("../misc/file");
const stuff = require("./info");
const http = require("http");

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "GET") return;
	const query = url.query;

	var attrs, params, name, begin, type, title, flashvars, object;
	switch (url.pathname) {
		case "/cc": {
			title = "Character Creator";
			begin = "Create";
			name = "character";
			type = "cc";
			attrs = {
				data: process.env.SWF_URL + "/go_full.swf",
				type: "application/x-shockwave-flash",
				id: "character_creator",
			};
			params = {
				flashvars: {
					themeId: "family",
					bs: "adam",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			flashvars = `{"apiserver":"\/","m_mode":"school","isLogin":"Y","isEmbed":"0","ctc":"go","tlang":"en_US","storePath":"https:\/\/josephcrosmanplays532.github.io\/store\/4e75f501cfbf51e3\/<store>","clientThemePath":"https:\/\/josephcrosmanplays532.github.io\/static\/642cd772aad8e952\/<client_theme>","appCode":"go","page":"","siteId":"school","userId":"0DyHqK6Yj9dM","themeId":"${params.flashvars.themeId}","ut":23,"bs":"${params.flashvars.bs}"}`;
			object = `<object data="https://josephcrosmanplays532.github.io/animation/414827163ad4eb60/cc.swf" type="application/x-shockwave-flash" id="char_creator" width="960" height="600" class="flpl_initiated"><param name="align" value="middle"><param name="allowScriptAccess" value="always"><param name="allowFullScreen" value="true"><param name="wmode" value="transparent"><param name="flashvars" value="apiserver=%2F&amp;m_mode=school&amp;bs=${params.flashvars.bs}&amp;isLogin=Y&amp;isEmbed=0&amp;ctc=go&amp;tlang=en_US&amp;storePath=https%3A%2F%2Fjosephcrosmanplays532.github.io%2Fstore%2F4e75f501cfbf51e3%2F%3Cstore%3E&amp;clientThemePath=https%3A%2F%2Fjosephcrosmanplays532.github.io%2Fstatic%2Fad44370a650793d9%2F%3Cclient_theme%3E&amp;appCode=go&amp;page=&amp;siteId=go&amp;userId=00EDZP3Cu0aw&amp;themeId=${params.flashvars.themeId}&amp;ut=30"><param name="movie" value="https://josephcrosmanplays532.github.io/animation/414827163ad4eb60/cc.swf"></object>`;
			break;
		}

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(`<html lang="en"><head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<link rel="dns-prefetch" href="//josephcrosmanplays532.github.io/">

<title>Make a Character - GoAnimate Rewritten</title>

<meta name="viewport" content="width=device-width, initial-scale=1">

<meta name="description" content="The Character Creator from GoAnimate - Create a character online with GoAnimate.">

<meta property="og:site_name" content="GoAnimate for Schools">
<meta property="fb:app_id" content="122508887813978">
<meta name="google-site-verification" content="Vta3YTpj6Kx6u4p-EzeMArY0alNItkyUYYMvNM8seVI">
<style>
#logo {
	margin-top: 4px;
	height: 35px;
}
</style>
<link rel="stylesheet" href="//fonts.googleapis.com/css?family=Lato:400,700">
<link rel="stylesheet" href="https://josephcrosmanplays532.github.io/static/ad44370a650793d9/go/css/common_combined.css.gz.css">

<link rel="stylesheet" href="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/school/css/cc.css.gz.css">

<script>
var srv_tz_os = -4, view_name = "school", user_cookie_name = "u_info_school";
var user_country = "US";
</script>

<!--[if lt IE 9]>
<script src="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/go/js/lib/html5shiv.js.gz.js"></script>
<![endif]-->
<script src="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/school/js/common_combined.js.gz.js"></script>
<script type="text/javascript" src="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/go/po/goserver_js-en_US.json.gz.json"></script>
<script type="text/javascript">
var I18N_LANG = 'en_US';
var GT = new Gettext({'locale_data': json_locale_data});
</script>
<script src="https://ga.vyond.com/ajax/cookie_policy" async=""></script>

<!-- Google Knowledge Graph -->
<script type="application/ld+json">
{
    "@context": "https://web.archive.org/web/20190524021043/http://schema.org",
    "@type": "Organization",
    "name": "GoAnimate",
    "url": "https://web.archive.org/web/20190524021043/http://goanimate.com",
    "logo": "https://web.archive.org/web/20190524021043/http://gawpstorage.s3.amazonaws.com/img/google_knowledge_graph_logo.jpg",
    "sameAs": [
        "https://web.archive.org/web/20190524021043/http://www.facebook.com/GoAnimateInc",
        "https://web.archive.org/web/20190524021043/http://twitter.com/GoAnimate",
        "https://web.archive.org/web/20190524021043/http://www.linkedin.com/company/goanimate",
        "https://web.archive.org/web/20190524021043/http://plus.google.com/+goanimate",
        "https://web.archive.org/web/20190524021043/http://www.youtube.com/user/GoAnimate"
    ]
}
</script>

</head>
<body class="page-action-character_creator" style="">
<script type="text/javascript">
if (self !== top) {
            jQuery('body').hide();
    }
</script>

<nav class="navbar site-nav" role="navigation">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
              </button>
            <a class="navbar-brand" href="/" title="GoAnimate for Schools">
                <img alt="GoAnimate for Schools" id="logo" src="https://freeanimate-rewriten.github.io/goanimate-rewritten/rewritten.png">
            </a>
        </div>
	
        <div class="collapse navbar-collapse navbar-ex1-collapse">
            <ul class="nav navbar-nav navbar-right">

                <li><a class="button_small" onclick="document.getElementById('file2').click()">UPLOAD A CHARACTER</a></li>
                <li class="dropdown">
                    <a class="dropdown-toggle" href="#" data-toggle="dropdown">Create a Character <span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="/cc?themeId=family&bs=adam">Adam</a></li>
			<li><a href="/cc?themeId=family&bs=eve">Eve</a></li>
			<li><a href="/cc?themeId=family&bs=bob">Bob</a></li>
			<li><a href="/cc?themeId=family&bs=rocky">Rocky</a></li>
			<li class="divider"></li>
		        <li><a href="/cc?themeId=business&bs=default">Business</a></li>
			<li><a href="/cc?themeId=business&bs=heavy">Heavy</a></li>
			<li><a href="/cc?themeId=business&bs=kid">Kid</a></li>
			<li class="divider"></li>
			<li><a href="/cc?themeId=whiteboard&bs=default">Whiteboard</a></li>
		        <li><a href="/cc?themeId=whiteboard&bs=kid">Whiteboard (Kid)</a></li>
			<li class="divider"></li>
			<li><a href="/cc?themeId=anime&bs=guy">Guy (Anime)</a></li>
			<li><a href="/cc?themeId=anime&bs=girl">Girl (Anime)</a></li>
			<li class="divider"></li>
			<li><a href="/cc?themeId=ninjaanime&bs=guy">Guy (Ninja Anime)</a></li>
			<li><a href="/cc?themeId=ninjaanime&bs=girl">Girl (Ninja Anime)</a></li>
			<li class="divider"></li>
			<li><a href="/cc?themeId=cc2&bs=default">Lil Peepz</a></li>
			<li claas="divider"></li>
			<li><a href="/cc?themeId=chibi&bs=default">Chibi Peepz</a></li>
			<li class="divider"></li>
			<li><a href="/cc?themeId=ninja&bs=default">Chibi Ninjas</a></li>
                    </ul>
                </li> 
                <li>
                    <a class="hidden-sm hidden-md hidden-lg" href="/go_full">Make a Video</a>
                    <span class="site-nav-btn hidden-xs"><a class="btn btn-orange" href="/go_full">Make a Video</a></span>
                </li>
            </ul>
        </div>
    </div>
</nav>

<div class="container container-cc">


        <ul class="breadcrumb">
            <li><a href="/go_full">Make a video</a></li>
            <li><a href="/cc?themeId=whiteboard&bs=default">Whiteboard Animation Characters</a></li>
            <li class="active">Create a new character</li>
        </ul>

<div>
    <div id="char_creator_client" align="center">${object}</div>
</div>
<script>
jQuery('#char_creator_client').flash({
    id: "char_creator",
    swf: "https://josephcrosmanplays532.github.io/animation/414827163ad4eb60/cc.swf",
    height: 600,
    width: 960,

    align: "middle",
    allowScriptAccess: "always",
    allowFullScreen: "true",
    wmode: "transparent",

    hasVersion: "10.3",

    flashvars: ${flashvars}});

function goSubscribe()
{
    var url = '/business/videoplans?hook=cc.site';
    window.open(url, 'goSubscribe');
}

function characterSaved()
{
    SetCookie('cc_saved', '1', 1, '/');
    window.location = '/cc?themeId=whiteboard';
}
</script>

</div>

<footer class="site-footer hidden-print">
    <div class="container">
        <div class="row site-footer-nav">
            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>About GoAnimate</h5>
                    <ul class="list-unstyled">
                        <li><a href="https://josephcrosmanplays532.github.io/about">Who We Are</a></li>
                        <li><a href="https://josephcrosmanplays532.github.io/contactus">Contact Us</a></li>
                        <li><a href="https://josephcrosmanplays532.github.io/video-maker-tips">Blog</a></li>
                        <li><a href="https://josephcrosmanplays532.github.io/web/20190524021043/https://press.goanimate.com/">Press</a></li>
                    </ul>
                </div>
            </div>

            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>GoAnimate Solutions</h5>
                    <ul class="list-unstyled">
                        <li><a href="https://josephcrosmanplays532.github.io/web/20190524021043/https://goanimate4schools.com/" target="_blank">GoAnimate for Schools</a></li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                    </ul>
                </div>
            </div>

            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>Usage Guidelines</h5>
                    <ul class="list-unstyled">
                        <li><a href="/html/termsofuse.html">Terms of Service</a></li>
                        <li><a href="/html/privacy.html">Privacy Policy</a></li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                    </ul>
                </div>
            </div>

            <div class="col-sm-3">
                <div class="site-footer-nav-col">
                    <h5>Getting Help</h5>
                    <ul class="list-unstyled">
                        <li><a href="https://josephcrosmanplays532.github.io/web/20190524021043/https://blog.goanimate4schools.com/">Educator Experiences</a></li>
                        <li><a href="https://josephcrosmanplays532.github.io/web/20190524021043/https://goanimate4schools.zendesk.com/hc/en-us">Help Center</a></li>
                        <li class="hidden-xs">&nbsp;</li>
                        <li class="hidden-xs">&nbsp;</li>
                    </ul>
                </div>
            </div>
        </div>
        <hr>

        <div class="row site-footer-copyright">
            <div class="col-sm-6">
                <div class="site-footer-socials-container">
                    Follow us on:
                    <ul class="site-footer-socials clearfix">
                        <li><a class="facebook" href="https://josephcrosmanplays532.github.io/web/20190524021043/https://www.facebook.com/GoAnimateInc">Facebook</a></li>
                        <li><a class="twitter" href="https://josephcrosmanplays532.github.io/web/20190524021043/https://twitter.com/Go4Schools">Twitter</a></li>
                        <li><a class="linkedin" href="https://josephcrosmanplays532.github.io/web/20190524021043/https://www.linkedin.com/company/goanimate">Linked In</a></li>
                        <li><a class="gplus" href="https://josephcrosmanplays532.github.io/web/20190524021043/https://plus.google.com/+goanimate">Google+</a></li>
                        <li><a class="youtube" href="https://josephcrosmanplays532.github.io/web/20190524021043/https://www.youtube.com/user/GoAnimate">YouTube</a></li>
                    </ul>
                </div>
            </div>
            <div class="col-sm-6">
                <div class="pull-right">
                    <img src="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/school/img/site/logo_amazon.png" alt="AWS Partner Network">
                    &nbsp;&nbsp;&nbsp;
                    GoAnimate © 2018
                </div>
            </div>
        </div>

    </div>
</footer>


<div id="studio_container" style="display: none;">
    <div id="studio_holder"><!-- Full Screen Studio -->
        <div style="top: 50%; position: relative;">
            You can't use GoAnimate because Flash might be disabled. <a href="https://get.adobe.com/flashplayer/">Enable Flash</a>.
        </div>
    </div>
</div>



<!--
     FILE ARCHIVED ON 02:10:43 May 24, 2019 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 19:46:07 Jan 15, 2022.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
-->
<!--
playback timings (ms):
  captures_list: 781.447
  exclusion.robots: 573.653
  exclusion.robots.policy: 573.645
  xauthn.identify: 85.897
  xauthn.chkprivs: 487.539
  cdx.remote: 0.081
  esindex: 0.009
  LoadShardBlock: 67.491 (3)
  PetaboxLoader3.datanode: 105.631 (4)
  CDXLines.iter: 15.78 (3)
  load_resource: 116.872
  PetaboxLoader3.resolve: 49.718
-->`)
	return true;
};
