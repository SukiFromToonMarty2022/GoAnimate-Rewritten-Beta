const themeFolder = process.env.THEME_FOLDER;
const mp3Duration = require('mp3-duration');
const char = require('../character/main');
const ttsInfo = require('../tts/info');
const source = process.env.CLIENT_URL;
const header = process.env.XML_HEADER;
const get = require('../request/get');
const fUtil = require('../movie/fileUtil');
const nodezip = require('node-zip');
const store = process.env.STORE_URL;
const xmldoc = require('xmldoc');
const fs = require('fs');
var cache = {}, filePath;

function generateId() {
	var id;
	do id = ('' + Math.random()).replace('.', '');
	while (cache[id]);
	return id;
}

async function parseMovie(zip, xmlBuffer, buffer, mId = null) {
	const chars = {}, themes = { common: true };
	fUtil.addToZip(zip, 'movie.xml', buffer);
	const xml = new xmldoc.XmlDocument(buffer);
	var scenes = xml.childrenNamed('scene');

	for (const sK in scenes) {
		var scene = scenes[sK];
		for (const pK in scene.children) {
			var piece = scene.children[pK];
			switch (piece.name) {
				case 'asset': {
					if (mId) {
						const aId = piece.attr.id;
						const m = useBase64(aId) ? 'base64' : 'utf8', b = Buffer.from(piece.val, m);
						const d = await new Promise(res => mp3Duration(b, (e, d) => e || res(Math.floor(1e3 * d))));
						const t = assetTypes[aId];
						//const n = `ugc.${t}.${aId}`;
						//fUtil.addToZip(zip, n, b);
						ugcString += `<sound subtype="${t.subtype}" id="${aId}" enc_asset_id="${aId
							}" name="${t.name}" downloadtype="progressive" duration="${d}"/>`;
						caché.save(mId, aId, b);
					}
					break;
				}

				case 'cc_char': {
					const beg = piece.startTagPosition - 1;
					const end = xmlBuffer.indexOf('</cc_char>', beg) + 10;
					const sub = xmlBuffer.subarray(beg, end);

					const name = piece.attr.file_name;
					const id = name.substr(9, name.indexOf('.', 9) - 9);
					const theme = await char.getTheme(await char.save(sub, id));
					themes[theme] = true;

					fUtil.addToZip(zip, piece.attr.file_name, sub);
					ugcString += `<char id="${id}"cc_theme_id="${theme}"><tags/></char>`;
					break;
				}

				case 'sound': {
					const sfile = piece.childNamed('sfile').val;
					const file = sfile.substr(sfile.indexOf('.') + 1);

					var ttsData = piece.childNamed('ttsdata');
					if (sfile.endsWith('.swf')) {
						const pieces = sfile.split('.');
						const theme = pieces[0], name = pieces[1];
						const url = `${store}/${theme}/sound/${name}.swf`;
						const fileName = `${theme}.sound.${name}.swf`;
						const buffer = await get(url);
						fUtil.addToZip(zip, fileName, buffer);
					}
					else if (sfile.startsWith('ugc.')) {
						var subtype, name;
						if (ttsData) {
							const text = ttsData.childNamed('text').val;
							const voice = ttsInfo.voices[ttsData.childNamed('voice').val].desc;
							name = `[${voice}] ${text.replace(/"/g, '\\"')}`;
							subtype = 'tts';
						} else {
							subtype = 'sound';
							name = file;
						}

						assetTypes[file] = {
							subtype: subtype,
							name: name,
						};
					}
					break;
				}

				case "scene": {
					var tag = piece.name;
					if (tag == "effectAsset") {
						tag = "effect";
					}

					switch (tag) {
						case "durationSetting":
						case "trans":
							break;
						case "bg":
						case "effect":
						case "prop": {
							var file = piece.childNamed("file");
							if (!file) continue;
							var val = file.val;
							var pieces = val.split(".");

							if (pieces[0] == "ugc") {
								// TODO: Make custom props load.
							} else {
								var ext = pieces.pop();
								pieces.splice(1, 0, tag);
								pieces[pieces.length - 1] += `.${ext}`;

								var fileName = pieces.join(".");
								if (!zip[fileName]) {
									var buff = await get(`${store}/${pieces.join("/")}`);
									fUtil.addToZip(zip, fileName, buff);
									themes[pieces[0]] = true;
								}
							}
							break;
						}
						case 'char': {
							const val = piece.childNamed('action').val;
							const pieces = val.split('.');

							let theme, fileName, buffer;
							switch (pieces[pieces.length - 1]) {
								case 'xml': {
									theme = pieces[0];
									const id = pieces[1];

									try {
										buffer = await char.load(id);
										const charTheme = await char.getTheme(id);
										fileName = `${theme}.char.${id}.xml`;
										if (theme == 'ugc')
											ugcString += `<char id="${id}"cc_theme_id="${charTheme}"><tags/></char>`;
									} catch (e) {
										console.log(e);
									}
									break;
								}
								case 'swf': {
									theme = pieces[0];
									const char = pieces[1];
									const model = pieces[2];
									const url = `${store}/${theme}/char/${char}/${model}.swf`;
									fileName = `${theme}.char.${char}.${model}.swf`;
									buffer = await get(url);
									break;
								}
							}

							for (const ptK in piece.children) {
								const part = piece.children[ptK];
								if (!part.children) continue;

								var urlF, fileF;
								switch (part.name) {
									case 'head':
										urlF = 'char';
										fileF = 'prop';
										break;
									case 'prop':
										urlF = 'prop';
										fileF = 'prop';
										break;
									default:
										continue;
								}

								const file = part.childNamed('file');
								const slicesP = file.val.split('.');
								slicesP.pop(), slicesP.splice(1, 0, urlF);
								const urlP = `${store}/${slicesP.join('/')}.swf`;

								slicesP.splice(1, 1, fileF);
								const fileP = `${slicesP.join('.')}.swf`;
								fUtil.addToZip(zip, fileP, await get(urlP));
							}

							if (buffer) {
								themes[theme] = true;
								fUtil.addToZip(zip, fileName, buffer);
							}
							break;
						}
						case 'bubbleAsset': {
							const bubble = piece.childNamed('bubble');
							const text = bubble.childNamed('text');
							const font = `${name2Font(text.attr.font)}.swf`;
							const fontSrc = `${source}/go/font/${font}`;
							fUtil.addToZip(zip, font, await get(fontSrc));
							break;
						}
					}
				}
				break;
			};
		}
	}
	const charKs = Object.keys(chars);
	const themeKs = Object.keys(themes);
	themeKs.forEach(t => fUtil.addToZip(zip, `${t}.xml`, fs.readFileSync(`_THEMES/${t}.xml`)));
	fUtil.addToZip(zip, 'themelist.xml', Buffer.from(`<?xml version="1.0" encoding="utf-8"?><themes>${
		themeKs.map(t => `<theme>${t}</theme>`).join('')}</themes>`));

	return await zip.zip();
}

module.exports = {
	load(path) {
		if (!fs.existsSync(path))
			return Promise.reject();
		cache = {}, filePath = path;
		const zip = nodezip.create();
		return parseMovie(zip, fs.readFileSync(path));
	},
	save(path, buffer) {
		return new Promise(res => {
			const zip = nodezip.unzip(buffer);

			var data = '';
			if (path != filePath)
				cache = {}, filePath = path;

			const stream = zip['movie.xml'].toReadStream();
			stream.on('data', b => data += b);
			stream.on('end', () => {
				var finalData = data.substr(0, data.length - 7);
				var count = 0; for (var i in zip.entries()) count++;
				if (count > 1)
					for (var i in zip.entries()) {
						var e = zip[i];
						if (!e || e.name == 'movie.xml') {
							count--; continue;
						}
						const chunks = [], str = e.toReadStream();
						str.on('data', b => chunks.push(b));
						str.on('end', () => {
							finalData += `< asset name = "${e.name}" > ${Buffer.concat(chunks)}</asset > `;
							if (!--count) fs.writeFile(path, finalData += `</film > `, res);
						});
					}
				else
					fs.writeFile(path, finalData += `</film > `, res);
			});
		});
	},
	addAsset(buffer) {
		const id = generateId();
		cache[id] = buffer;
		return id;
	},
	getAsset(id) {
		return cache[id];
	}
}
