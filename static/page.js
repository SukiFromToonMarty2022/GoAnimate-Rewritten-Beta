const sessions = require('../data/sessions-preview');
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

	var attrs, params, title, script;
	switch (url.pathname) {
		case '/cc': {
			title = 'Character Creator';
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
			script += `function characterSaved(){window.location='/html/list.html}`;
			break;
		}

		case '/go_full': {
			let presave = query.movieId && query.movieId.startsWith('m') ? query.movieId :
				`m-${fUtil[query.noAutosave ? 'getNextFileId' : 'fillNextFileId']('movie-', '.xml')}`;
			let ip = req.headers['x-forwarded-for'];
			title = 'Video Editor';
			attrs = {
				data: process.env.SWF_URL + '/go_full.swf',
				type: 'application/x-shockwave-flash', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'storePath': process.env.STORE_URL + '/<store>', 'isEmbed': 1, 'ctc': 'go',
					'ut': 60, 'bs': 'default', 'appCode': 'go', 'page': '', 'siteId': 'go', 'lid': 13, 'isLogin': 'Y', 'retut': 1,
					'clientThemePath': process.env.CLIENT_URL + '/<client_theme>', 'themeId': 'business', 'tlang': 'en_US',
					'presaveId': presave, 'goteam_draft_only': 1, 'isWide': 1, 'nextUrl': '/html/list.html', 'autostart': '1',
				},
				allowScriptAccess: 'always',
			};
			script += `interactiveTutorial={${params.flashvars.tutorial}:function(){return true}};function studioLoaded(arg){console.log(arg)}function initPreviewPlayer(xml){console.log('Starting preview transfer.');var a=xml.split('');function f(){var s=a.splice(0,5e5);if(s.length)fetch('/save_preview/',{method:'POST',body:s.join('')}).then(f);else window.open('/previewWindow?autostart=${params.flashvars.autostart}','MsgWindow','width=1280,height=720,left='+(screen.width/2-640)+',top='+(screen.height/2-360))};f()};function exitStudio(){window.location='/html/list.html'}const fu=document.getElementById('fileupload'),sub=document.getElementById('submit');function showImporter(){fu.click()}fu.addEventListener('change',evt=>(evt.target.files[0]!=undefined)&&sub.click(),false);`;
			sessions.set(presave, ip);
			break;
		}

		case '/player': {
			title = 'Player';
			attrs = {
				data: process.env.SWF_URL + '/player.swf',
				type: 'application/x-shockwave-flash', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'storePath': process.env.STORE_URL + '/<store>', 'ut': 60,
					'autostart': 1, 'isWide': 1, 'clientThemePath': process.env.CLIENT_URL + '/<client_theme>',
				},
				allowScriptAccess: 'always',
			};
			break;
		}
			
		case '/previewWindow': {
			title = 'Player';
			attrs = {
				data: process.env.SWF_URL + '/player.swf',
				type: 'application/x-shockwave-flash', width: '100%', height: '100%',
			};
			params = {
				flashvars: {
					'apiserver': '/', 'storePath': process.env.STORE_URL + '/<store>', 'ut': 60,
					'autostart': 1, 'isWide': 1, 'clientThemePath': process.env.CLIENT_URL + '/<client_theme>',
					'isInitFromExternal': '1',
				},
				allowScriptAccess: 'always',
			};
			script += `function retrievePreviewPlayerData(){var r=new XMLHttpRequest();r.open('GET','/load_preview',false);r.send(null);return r.responseText}`;
			break;
		}

		default:
			return;
	}
	res.setHeader('Content-Type', 'text/html; charset=UTF-8');
	Object.assign(params.flashvars, query);
	res.end(`<script>document.title='${title}',flashvars=${JSON.stringify(params.flashvars)}</script><body style="margin:0px">${toObjectString(attrs, params)
		}</body><iframe style='display:none'name='dummy'></iframe><form style='display:none'id='uploadbanner'enctype='multipart/form-data'method='post'action='/upload_asset/'target='dummy'><input id='fileupload'name='import'type='file'/><input type='submit'value='submit'id='submit'/></form><script>${script}</script>`);
	return true;
}
