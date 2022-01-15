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

	var attrs, params, name, begin, title;
	switch (url.pathname) {
		case "/cc": {
			title = 'Character Creator';
			name = 'character';
			begin = 'Create';
			type = 'cc_browser';
			attrs = {
				data: process.env.SWF_URL + '/cc.swf', // data: 'cc.swf',
				type: 'application/x-shockwave-flash', 
				id: 'char_creator',
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: 60,
					bs: "adam",
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					isEmbed: 1,
					ctc: "go",
					tlang: "en_US",
                    nextUrl: "/cc_browser",
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc.swf", // 'http://localhost/cc.swf'
			};
			break;
		}

		case "/cc_browser": {
			title = "Character Browser";
			begin = "Browse";
			name = "characters";
			type = "cc_browser";
			attrs = {
				data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
				type: "application/x-shockwave-flash",
				id: "char_browser",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					original_asset_id: query["id"] || null,
					themeId: "family",
					ut: 30,
					appCode: "go",
					page: "",
					siteId: "go",
					m_mode: "school",
					isLogin: "Y",
					retut: 1,
					goteam_draft_only: 1,
					isEmbed: 1,
					ctc: "go",
					tlang: "en_US",
					lid: 13,
				},
				allowScriptAccess: "always",
				movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
			};
			break;
		}

		case "/go_full":
		case "/go_full/tutorial": {
			let presave =
				query.movieId && query.movieId.startsWith("m")
					? query.movieId
					: `m-${fUtil[query.noAutosave ? "getNextFileId" : "fillNextFileId"]("movie-", ".xml")}`;
			title = "Video Editor";
			begin = "Create";
			name = "video";
			type = "go_full";
			attrs = {
				data: process.env.SWF_URL + "/go_full.swf",
				type: "application/x-shockwave-flash",
				id: "video_maker",
			};
			params = {
				flashvars: {
					apiserver: "/",
					tray: "custom",
					storePath: process.env.STORE_URL + "/<store>",
					isEmbed: 1,
					ctc: "go",
					ut: 50,
					bs: "default",
					appCode: "go",
					page: "",
					siteId: "go",
					lid: 13,
					isLogin: "Y",
					retut: 0,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
					themeId: "custom",
					tlang: "en_US",
					presaveId: presave,
					goteam_draft_only: 1,
					isWide: 1,
					collab: 0,
					nextUrl: "../pages/html/list.html",
					noSkipTutorial: 1,
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		case "/player": {
			title = "Video Player";
			begin = "Play";
			name = "video";
			type = "player";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				id: "video_player",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					ut: 30,
					autostart: 1,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
			break;
		}

		case "/recordWindow": {
			title = "Record Window";
			begin = "Record";
			name = "video";
			type = "player";
			attrs = {
				data: process.env.SWF_URL + "/player.swf",
				type: "application/x-shockwave-flash",
				id: "video_player",
				quality: "medium",
			};
			params = {
				flashvars: {
					apiserver: "/",
					storePath: process.env.STORE_URL + "/<store>",
					ut: 30,
					autostart: 0,
					isWide: 1,
					clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
				},
				allowScriptAccess: "always",
				allowFullScreen: "true",
			};
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
<link rel="dns-prefetch" href="//d2qrjeyl4jwu9j.cloudfront.net/">

<title>GoAnimate Rewritten and GoAnimators - ${begin} ${name} - GoAnimate Rewritten</title>

<meta name="viewport" content="width=device-width, initial-scale=1">

<meta name="description" content="The Video Maker lets You make a video for YouTube for free! Drag &amp; drop or type &amp; go.  It's Fast, Fun, Easy and Free -  GoAnimate!">

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

<link rel="stylesheet" href="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/go/css/importer.css.gz.css">
<link rel="stylesheet" href="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/school/css/studio.css.gz.css">

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
<script src="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/go/js/movie.js.gz.js"></script>
<script src="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/go/js/cookie.js.gz.js"></script>
<script src="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/go/js/studio.js.gz.js"></script>
<script src="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/go/js/jquery/jquery.tmpl.min.js.gz.js"></script>
<script src="https://josephcrosmanplays532.github.io/static/642cd772aad8e952/school/js/studio.js.gz.js"></script>

<!-- Google Knowledge Graph -->
<script type="application/ld+json">
{
    "@context": "https://web.archive.org/web/20190524204241/http://schema.org",
    "@type": "Organization",
    "name": "GoAnimate",
    "url": "https://web.archive.org/web/20190524204241/http://goanimate.com",
    "logo": "https://web.archive.org/web/20190524204241/http://gawpstorage.s3.amazonaws.com/img/google_knowledge_graph_logo.jpg",
    "sameAs": [
        "https://web.archive.org/web/20190524204241/http://www.facebook.com/GoAnimateInc",
        "https://web.archive.org/web/20190524204241/http://twitter.com/GoAnimate",
        "https://web.archive.org/web/20190524204241/http://www.linkedin.com/company/goanimate",
        "https://web.archive.org/web/20190524204241/http://plus.google.com/+goanimate",
        "https://web.archive.org/web/20190524204241/http://www.youtube.com/user/GoAnimate"
    ]
}
</script>

</head>
<body class="page-action-videomaker full_screen_studio" style="">
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
                    <a class="hidden-sm hidden-md hidden-lg" href="">Make a Video</a>
                    <span class="site-nav-btn hidden-xs"><a class="btn btn-orange" href="">Make a Video</a></span>
                </li>
            </ul>
        </div>
    </div>
</nav>
<link href="//fonts.googleapis.com/css?family=Lato" rel="stylesheet" type="text/css">


<div style="position:relative;">
    <div id="studioBlock" style="height: 0px;"><!-- --></div>

    <div id="playerBlock"></div>
</div>

    <div id="previewPlayerContainer" style="display: none;">
        <div class="preview-player" id="previewPlayer">
            <h2>Preview Video</h2>
            <div id="playerdiv"></div>
            <div class="buttons clearfix">
                <button class="preview-button edit" onclick="switchBackToStudio();">Back to editing</button>
                <button class="preview-button save" onclick="publishStudio();">Save Now</button>            </div>

            <a class="close_btn" href="#" onclick="switchBackToStudio(); return false;">×</a>
        </div>
    </div>
    <div class="video-tutorial" id="video-tutorial" style="display: none;">
        <div class="video-tutorial-body">
            <h2>&nbsp;</h2>
            <div class="video-tutorial-player">
                <div id="wistia_player" class="wistia_embed" style="width:860px;height:445px">&nbsp;</div>
            </div>
            <a class="close_btn" href="#" onclick="return false;">×</a>
        </div>
        <div class="video-tutorial-footer clearfix">
            <button class="tutorial-button" type="button">
                Close            </button>
        </div>
    </div>


<div style="display:none">
    
</div>

<script>

    var hideHTMLBox = function() {
        window.close();
    };

    function tutorialStarted() {
    }
    function tutorialStep(sn) {
    }
    function tutorialCompleted() {
    }

    var enable_full_screen = true;

    var studio_data = {
        id: "Studio",
        swf: "https://josephcrosmanplays532.github.io/animation/414827163ad4eb60/${type}.swf",
        width: "100%",
        height: "100%",

        align: "middle",
        allowScriptAccess: "always",
        allowFullScreen: "true",
        wmode: "window",

        hasVersion: "10.3"
    };

    if (!enable_full_screen) {
        studio_data.width  = 960;
        studio_data.height  = 630;
        resize_studio = false;
    }

studio_data.flashvars = {"movieId":"","loadas":0,"asId":"","originalId":"","apiserver":"\/","storePath":"https:\/\/josephcrosmanplays532.github.io\/store\/4e75f501cfbf51e3\/<store>","clientThemePath":"https:\/\/josephcrosmanplays532.github.io\/static\/a58ff843b3f92207\/<client_theme>","animationPath":"https:\/\/josephcrosmanplays532.github.io\/animation\/cce25167cb1d3404\/","userId":"0VLx9lDwEqAA","username":"GoAnimate Rewrui","uemail":"lhp73672@pdold.com","numContact":"0","ut":23,"ve":false,"isEmbed":0,"nextUrl":"\/movie\/<movieId>\/0\/1","bgload":"https:\/\/josephcrosmanplays532.github.io\/animation\/cce25167cb1d3404\/go_full.swf","lid":"12","ctc":"go","themeColor":"silver","tlang":"en_US","siteId":"12","templateshow":"false","forceshow":"false","appCode":"go","lang":"en","tmcc":"192","fb_app_url":"https:\/\/josephcrosmanplays532.github.io\/","is_published":"1","is_private_shared":"0","upl":1,"role":"teacher","hb":"1","pts":"0","msg_index":"","ad":0,"has_asset_bg":0,"has_asset_char":0,"initcb":"studioLoaded","retut":0,"s3base":"https:\/\/s3.amazonaws.com\/fs.goanimate.com\/","st":"","uisa":0,"u_info_school":"OjI6blIwOGZwQl93Q1FiaTJVOHZvektGZzNfVjJnZXRaaXBaMjY1TW9jTVBLeEFHUzk0aDhOWXVpRlRpdk5XcGpMN29Xd1NESURIaHlyNFZLRXpwczUyY29KR3RpQWJ2cUN0U21wWDh3T080WnUxYm9icHJBYlQ4PQ==","tm":"FIN","tray":"custom","uplp":1,"isWide":1};

var _ccad = null;

function proceedWithFullscreenStudio() {
    // These should be executed only when we are really ready to show the studio
    window.onbeforeunload = function(e) {
        var e = e || window.event;
        var msg = null;
        if (loadedFullscreenStudio && studioApiReady) {
            msg = 'You are about to lose all your unsaved changes in the studio.';
        }
        if (e && msg != null) {
            e.returnValue = msg;
        }

        if (msg != null) {
            return msg;
        }
    };

    $('div#studioBlock').css('height', '0px');
    $('#studio_holder').flash(studio_data);
    full_screen_studio();

    ajust_studio();
}


    var studioApiReady = false;
    var videoTutorial = null;

    function studioLoaded() {
        studioApiReady = true;
        $(document).trigger('studioApiReady');
    };
    $(document).ready(function() {
        if (enable_full_screen) {

            if (!true) {
                $('#studio_container').css('top', '0px');
            }
            $('#studio_container').show();
            $('.site-footer').hide();
            $('#studioBlock').css('height', '1800px');

            if (false) {
                checkCopyMovie('javascript:proceedWithFullscreenStudio()', '');
            } else if (false) {
                checkEditMovie('');
            } else {
                proceedWithFullscreenStudio();
            }

            $(window).on('resize', function() {
                ajust_studio();
            });
            $(window).on('studio_resized', function() {
                if (show_cc_ad) {
                    _ccad.refreshThumbs();
                }
            });

            if (studioApiReady) {
                var api = studioApi($('#studio_holder'));
                api.bindStudioEvents();
            }
            $('.ga-importer').prependTo($('#studio_container'));
        } else {
            $('#studioBlock').flash(studio_data);
        }
        // Video Tutorial
        videoTutorial = new VideoTutorial($("#video-tutorial"));
    })
    // restore studio when upsell overlay hidden
    .on('hidden', '#upsell-modal', function(e) {
        if ($(e.target).attr('id') == 'upsell-modal') {
            restoreStudio();
        }
    })
    .on('studioApiReady', function() {
        var api = studioApi($('#studio_holder'));
        api.bindStudioEvents();
    })
    jQuery("#previewPlayerContainer, #video-tutorial").hide();

    function initPreviewPlayer(dataXmlStr, startFrame) {
        savePreviewData(dataXmlStr);

        if (typeof startFrame == 'undefined') {
            startFrame = 1;
        } else {
            startFrame = Math.max(1, parseInt(startFrame));
        }

        previewSceen();
        jQuery("#previewPlayerContainer").show();

        createPreviewPlayer("playerdiv", {
            height: 360,
            width: 640,
            player_url: "https://josephcrosmanplays532.github.io/animation/414827163ad4eb60/player.swf",
            quality: "high"
        }, {
            movieOwner: "", movieOwnerId: "", movieId: "${params.flashvars.presaveId}", ut: "-1",
            movieLid: "8", movieTitle: "", movieDesc: "", userId: "", username: "", uemail: "",
            apiserver: "https://goanimatewrapperu.herokuapp.com/", thumbnailURL: "", copyable: "0", isPublished: "0", ctc: "go", tlang: "en_US", is_private_shared: "0",
            autostart: "1", appCode: "go", is_slideshow: "0", originalId: "0", is_emessage: "0", isEmbed: "0", refuser: "",
            utm_source: "", uid: "", isTemplate: "1", showButtons: "0", chain_mids: "", showshare: "0", averageRating: "",
                        s3base: "https://s3.amazonaws.com/fs.goanimate.com/",
                        ratingCount: "", fb_app_url: "https://josephcrosmanplays532.github.io/", numContact: 0, isInitFromExternal: 1, storePath: "https://josephcrosmanplays532.github.io/store/4e75f501cfbf51e3/<store>", clientThemePath: "https://josephcrosmanplays532.github.io/static/a58ff843b3f92207/<client_theme>", animationPath: "https://josephcrosmanplays532.github.io/animation/cce25167cb1d3404/",
            startFrame: startFrame
        });
    }
    function switchBackToStudio() {
        try {
            (jQuery("#previewPlayerContainer #Player").get(0) || {pause:function(){}}).pause();
        } catch (err) {};
        jQuery("#previewPlayerContainer").hide();
        restoreStudio();
        document.getElementById("Studio").onExternalPreviewPlayerCancel();
    }
    function publishStudio() {
        try {
            (jQuery("#previewPlayerContainer #Player").get(0) || {pause:function(){}}).pause();
        } catch (err) {};
        jQuery("#previewPlayerContainer").hide();
        restoreStudio();
        document.getElementById("Studio").onExternalPreviewPlayerPublish();
    }
    function exitStudio(share) {
        loadedFullscreenStudio = false;
    }

    VideoTutorial.tutorials.composition = {
        title: 'Composition Tutorial',
        wistiaId: 'nuy96pslyp',
    };
    VideoTutorial.tutorials.enterexit = {
        title: 'Enter and Exit Effects Tutorial',
        wistiaId: 'fvjsa3jnzc',
    }
</script>

<script id="importer-file-tmpl" type="text/x-jquery-tmpl">
    <li class="ga-importer-file clearfix fade">
        <div class="ga-importer-file-icon"><div class="ga-importer-file-progress-bar"><div class="upload-progress"></div></div></div>
        <div class="ga-importer-file-body">
            <div class="filename"></div>
            <div class="actions clearfix">
                <span class="menu"></span>
                <span class="category"></span>
                <a class="cancel" href="#" data-action="cancel-upload" title="Cancel">&times;</a>
                <a class="add-to-scene" href="#" data-action="add-to-scene">Add to scene</a>
                <span class="processing">Processing. Please wait...</span>
                <span class="error"></span>
            </div>
        </div>
    </li>
</script>

<script id="importer-select-sound-tmpl" type="text/x-jquery-tmpl">
    <div class="dropdown">
        <a class="import-as-btn dropdown-toggle" data-toggle="dropdown" href="#">Import as <span class="caret"></span></a>
        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
            <li><a tabindex="-1" href="#" data-subtype="bgmusic">Music</a></li>
            <li><a tabindex="-1" href="#" data-subtype="soundeffect">Sound Effect</a></li>
            <li><a tabindex="-1" href="#" data-subtype="voiceover">Voice-Over</a></li>
        </ul>
    </div>
</script>

<script id="importer-select-prop-tmpl" type="text/x-jquery-tmpl">
    <div class="dropdown">
        <a class="import-as-btn dropdown-toggle" data-toggle="dropdown" href="#">Import as <span class="caret"></span></a>
        <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu">
            <li><a tabindex="-1" href="#" data-subtype="prop">Prop</a></li>
            <li><a tabindex="-1" href="#" data-subtype="bg">Background</a></li>
        </ul>
    </div>
</script>
<script src="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/js/importer.js.gz.js"></script>
<script>window.searchTermsDataUrl = 'https://web.archive.org/web/20180207180629/https://d2qrjeyl4jwu9j.cloudfront.net/store/4e75f501cfbf51e3/common/terms.json';</script>
<script src="https://josephcrosmanplays532.github.io/GoAnimate-Rewriten-Files/studio/js/search-suggestion.js.gz.js"></script>

<script>
ImporterFile.defaults.options.accept_mime = ["image\/png","image\/jpeg","image\/gif","image\/bmp","audio\/mpeg","audio\/wav","audio\/x-wav","audio\/vnd.wave","audio\/wave","audio\/mp3","audio\/mp4","audio\/ogg","audio\/vorbis","audio\/aac","audio\/m4a","audio\/x-m4a","application\/x-shockwave-flash","video\/mp4","video\/mpeg4","video\/x-flv","video\/x-ms-wmv","application\/mp4"];
ImporterFile.defaults.options.restricted_mime = [];
</script>

<script charset="ISO-8859-1" src="//fast.wistia.com/assets/external/E-v1.js"></script><style id="wistia_19_style" type="text/css" class="wistia_injected_style">
@font-face {
font-family: 'WistiaPlayerOverpassNumbers';
src: url(data:application/x-font-ttf;charset=utf-8;base64,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);
}
</style><style id="wistia_27_style" type="text/css" class="wistia_injected_style">
@font-face {
font-family: 'WistiaPlayerOverpass';
src: url(data:application/x-font-ttf;charset=utf-8;base64,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);
}
</style>


<div id="studio_container" style="width: 1104px; height: 1094px;"><div class="ga-importer">
        <div class="ga-importer-header">
            <form class="ga-importer-base-form" action="/ajax/saveUserProp" method="post">
                <a class="ga-importer-collapse" href="#" title="Collapse" onclick="hideImporter(); return false;">×</a>
                <div class="fileinputs">
                    <div class="importer-button file-trigger" style="width:140px;">SELECT FILES</div>
                    <input class="ga-importer-file-input" type="file" name="file" multiple="">
                </div>
                <span class="hints">
                    <i class="i-help"></i>
                    <div class="tooltip in" style="display:none;">
                        <div class="tooltip-arrow"></div>
                        <div class="tooltip-inner">
                            <ul>
                                <li>Maximum file size: 15MB</li>
                                <li>Images: JPG, PNG<br>To cover the whole stage in a 1080p video, use an image at least 1920px x 1080px.</li>
                                <li>Audio: MP3, WAV, M4A</li>
                                    <li>Video: MP4, SWF.</li>
                                </ul>
                        </div>
                    </div>
                </span>
                <input type="hidden" name="subtype" value="">
            </form>
        </div>
        <div class="ga-importer-content" style="height: 1043px;">
            <div class="ga-importer-start">
                <div class="ga-importer-start-draghere">Drag files here</div>
                <div class="ga-importer-instruction general">
                    <ul>
                        <li><strong>Maximum file size:</strong> 15MB</li>
                        <li><strong>Images:</strong> JPG, PNG<br>To cover the whole stage in a 1080p video, use an image at least 1920px x 1080px.</li>
                        <li><strong>Audio:</strong> MP3, WAV, M4A</li>
                            <li><strong>Video:</strong> MP4, SWF. For more information about uploading SWF files, please click <a href="#" onclick="$('.ga-importer-instruction').toggle(); return false;">here</a>.</li>
                        </ul>
                </div>
                <div class="ga-importer-instruction for-swf" style="display: none;">
                    <p class="text-center"><b>For a .swf file</b></p>
                    <ul>
                        <li><strong>Frame rate:</strong> 24 frames per second</li>
                        <li><strong>Flash Player version:</strong> 9</li>
                        <li><strong>Load order:</strong> Bottom up</li>
                        <li><strong>Action Script version:</strong> 3.0<br>You may use limited frame-navigation functions in ActionScript functions like "gotoAndPause", "pause" or "play". Please note that ActionScript functions may create problems when users watch a video and drag the player timeline manually.</li>
                        <li><strong>Content positioning:</strong> Place the center of your prop at the origin of your stage (i.e. x=0 and y=0).</li>
                    </ul>
                    <div class="text-center"><a href="#" onclick="$('.ga-importer-instruction').toggle(); return false;">Back</a></div>
                </div>
            </div>
            <div class="ga-importer-results">
                <div class="ga-importer-notice clearfix"><span class="ga-importer-notice-count pull-left">0 file have been added to Your Library.</span> <a class="ga-importer-notice-clear pull-right" href="#">Clear</a></div>
                <ul class="ga-importer-files"></ul>
            </div>
            <div class="ga-importer-queue-message">
                Assign a category to start importing
                <span class="hints pull-right">
                    <i class="i-help"></i>
                    <div class="tooltip in" style="display:none;">
                        <div class="tooltip-arrow"></div>
                        <div class="tooltip-inner">
                            <p>Imported files are categorized to simplify browsing.</p>
                            <p>Use the "IMPORT AS" drop down to see the available categories based on the format of the file you import.</p>
                        </div>
                    </div>
                </span>
            </div>
            <ul class="ga-importer-queue"></ul>
        </div>
        <div class="ga-import-dnd-hint">
            Release to start uploading        </div>
    </div>
    <div id="studio_holder" style="width: 1104px;"><object data="https://josephcrosmanplays532.github.io/animation/cce25167cb1d3404/go_full.swf" type="application/x-shockwave-flash" id="Studio" width="100%" height="100%"><param name="align" value="middle"><param name="allowScriptAccess" value="always"><param name="allowFullScreen" value="true"><param name="wmode" value="window"><param name="flashvars" value="movieId=&amp;loadas=0&amp;asId=&amp;originalId=&amp;apiserver=https%3A%2F%2Fgoanimatewrapperu.herokuapp.com%2F&amp;storePath=https%3A%2F%2Fjosephcrosmanplays532.github.io%2Fstore%2F4e75f501cfbf51e3%2F%3Cstore%3E&amp;clientThemePath=https%3A%2F%2Fjosephcrosmanplays532.github.io%2Fstatic%2Fa58ff843b3f92207%2F%3Cclient_theme%3E&amp;animationPath=https%3A%2F%2Fjosephcrosmanplays532.github.io%2Fanimation%2Fcce25167cb1d3404%2F&amp;userId=0VLx9lDwEqAA&amp;username=GoAnimate%20Rewrui&amp;uemail=lhp73672%40pdold.com&amp;numContact=0&amp;ut=23&amp;ve=false&amp;isEmbed=0&amp;nextUrl=%2Fmovie%2F%3CmovieId%3E%2F0%2F1&amp;bgload=https%3A%2F%2Fjosephcrosmanplays532.github.io%2Fanimation%2Fcce25167cb1d3404%2Fgo_full.swf&amp;lid=11&amp;ctc=go&amp;themeColor=silver&amp;tlang=en_US&amp;siteId=12&amp;templateshow=false&amp;forceshow=false&amp;appCode=go&amp;lang=en&amp;tmcc=192&amp;fb_app_url=https%3A%2F%2Fjosephcrosmanplays532.github.io%2F&amp;is_published=1&amp;is_private_shared=0&amp;upl=1&amp;role=teacher&amp;hb=1&amp;pts=0&amp;msg_index=&amp;ad=0&amp;has_asset_bg=0&amp;has_asset_char=0&amp;initcb=studioLoaded&amp;retut=0&amp;s3base=https%3A%2F%2Fs3.amazonaws.com%2Ffs.goanimate.com%2F&amp;st=&amp;uisa=0&amp;u_info_school=OjI6blIwOGZwQl93Q1FiaTJVOHZvektGZzNfVjJnZXRaaXBaMjY1TW9jTVBLeEFHUzk0aDhOWXVpRlRpdk5XcGpMN29Xd1NESURIaHlyNFZLRXpwczUyY29KR3RpQWJ2cUN0U21wWDh3T080WnUxYm9icHJBYlQ4PQ%3D%3D&amp;tm=FIN&amp;tray=whiteboard&amp;uplp=1&amp;isWide=1"><param name="movie" value="https://josephcrosmanplays532.github.io/animation/cce25167cb1d3404/go_full.swf"></object></div>
</div>

<form enctype='multipart/form-data' action='/upload_character' method='post'>
	<input id='file2' type="file" onchange="this.form.submit()" name='import' />
</form>

<!--
     FILE ARCHIVED ON 20:42:41 May 24, 2019 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 16:20:26 Jan 15, 2022.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
-->
<!--
playback timings (ms):
  captures_list: 2782.91
  exclusion.robots: 2231.229
  exclusion.robots.policy: 2231.219
  xauthn.identify: 1431.341
  xauthn.chkprivs: 799.662
  cdx.remote: 0.049
  esindex: 0.006
  LoadShardBlock: 512.35 (3)
  PetaboxLoader3.datanode: 537.118 (4)
  CDXLines.iter: 14.146 (3)
  load_resource: 87.939
  PetaboxLoader3.resolve: 30.526
-->`)
	return true;
};
