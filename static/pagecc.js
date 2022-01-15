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

	var attrs, params, title;
	switch (url.pathname) {
		case "/cc": {
			title = 'Character Creator';
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

		default:
			return;
	}
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.end(`
	<head>
		<script>
			document.title='${title}',flashvars=${JSON.stringify(params.flashvars)}
		</script>
		<script src="https://vyond-legacy-revived.github.io/Wrapper-Offline-Beta/wrapper/pages/js/stuff.js"></script>
		<link rel="stylesheet" type="text/css" href="https://vyond-legacy-revived.github.io/Wrapper-Offline-Beta/wrapper/pages/css/modern-normalize.css">
		<link rel="stylesheet" type="text/css" href="https://vyond-legacy-revived.github.io/Wrapper-Offline-Beta/wrapper/pages/css/global.css">
		<link rel="stylesheet" type="text/css" href="https://vyond-legacy-revived.github.io/Wrapper-Offline-Beta/wrapper/pages/css/swf.css">
	</head>
	
	<header id="header">
		<a href="/">
			<h1 style="margin:0"><img id="logo" src="https://freeanimate-rewriten.github.io/goanimate-rewritten/rewritten.png" alt="Wrapper: Offline"/></h1>
		</a>
		<nav id="headbuttons">
			<div class="dropdown_contain button_small">
				<div class="dropdown_button upload_button">UPLOAD</div>
				<nav class="dropdown_menu">
					<a onclick="document.getElementById('file').click()">Movie</a>
					<a onclick="document.getElementById('file2').click()">Character</a>
				</nav>
			</div>
			<a href="/videomaker" class="button_big">CREATE</a>
		</nav>
	</header>
	
	<body>
		<main>
			${toObjectString(attrs, params)}
		</main>
		<form enctype='multipart/form-data' action='/upload_movie' method='post'>
			<input id='file' type="file" onchange="this.form.submit()" name='import' />
		</form>
		<form enctype='multipart/form-data' action='/upload_character' method='post'>
			<input id='file2' type="file" onchange="this.form.submit()" name='import' />
		</form>
	</body>${stuff.pages[url.pathname] || ''}`)
	return true;
};
