const sessions = require('../data/sessions');
const fUtil = require('../fileUtil');
const stuff = require('./info');

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
	return `<object id="obj" ${Object.keys(attrs).map(key =>
		`${key}="${attrs[key].replace(/"/g, "\\\"")}"`
	).join(' ')}>${toParamString(params)}</object>`;
}

module.exports = function (req, res, url) {
	if (req.method != 'GET') return;
	const query = url.query;

	var attrs, params, stuff;
	switch (url.pathname) {
		case '/goanimate-rewritten/code': {
			params = {
				flashvars: {
					'type': 'adam', 'theme': 'family',
				},
			};
      break;
		}

		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
	res.end(`<html><head></head><body><pre style="word-wrap: break-word; white-space: pre-wrap;">var character = "${params.flashvars.type}"; // change to "adam", "bob" , "eve" , or "rocky" depending on who you want to start with.\
/* this command is ment to remove the reminder after this script is pasted into the console of developer tools. */ document.getElementById('reminder').style.display = "none";\

$(\'#char_creator_client\').flash({\
   id: "char_creator",\
   swf: "https://josephcrosmanplays532.github.io/animation/414827163ad4eb60/cc.swf",\
   height: 600,\
   width: 960,\

   align: "middle",\
   allowScriptAccess: "always",\
   allowFullScreen: "true",\
   wmode: "transparent",\

   hasVersion: "10.3",\

   flashvars: {"apiserver":"\/","m_mode":"school","bs":character,"isLogin":"Y","isEmbed":"0","ctc":"go","tlang":"en_US","storePath":"https:\/\/josephcrosmanplays532.github.io\/store\/4e75f501cfbf51e3\/&lt;store&gt;","clientThemePath":"https:\/\/josephcrosmanplays532.github.io\/static\/ad44370a650793d9\/&lt;client_theme&gt;","appCode":"go","page":"","siteId":"go","userId":"00EDZP3Cu0aw","themeId":"${params.flashvars.theme}","ut":30}});\
</pre></body></html>`);
	return true;
}
