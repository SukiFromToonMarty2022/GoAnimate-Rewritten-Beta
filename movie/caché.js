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

async function parseMovie(zip, buffer, thumb = null, movieId) {
	return new Promise(res => {

		const pieces = [];
		const stream = fUtil.addToZip(zip, 'movie.xml', buffer);
		stream.on('data', b => pieces.push(b));
			stream.on('end', async () => {
				const time = new Date() - 0;
				const main = Buffer.concat(pieces).slice(0, -7);
				const xmlBuffers = [], assetHash = {};
				const charMap = {}, charBuffers = {};
				for (let c = 0, end; ; c = main.indexOf('ugc.', c) + 4) {
					
					if (c == 0) continue; else if (c == 3) {
						xmlBuffers.push(main.subarray(end));
						break;
					}

					xmlBuffers.push(main.subarray(end, c));
					const assetId = main.subarray(c, end =
						main.indexOf('<', c + 1)).toString();
					const index = assetId.indexOf('-');
					const prefix = assetId.substr(0, index);
					switch (prefix) {
						case 'c':
						case 'C': {
							const dot = assetId.indexOf('.');
							const charId = assetId.substr(0, dot);
							const saveId = charMap[charId] =
								charMap[charId] || `C-${c}-${time}`;
							const remainder = assetId.substr(dot);
							xmlBuffers.push(Buffer.from(saveId + remainder));
							try {
								charBuffers[saveId] = await char.load(charId);
							} catch (e) { };
							break;
						}
						default: {
							xmlBuffers.push(Buffer.from(assetId));
							assetHash[assetId] = true;
						}
					}
				}

				const assetBuffers = caché.getTable(movieId);
				for (const aId in assetBuffers) {
					if (!assetHash[aId]) continue;
					if (useBase64(aId)) {
						const assetString = assetBuffers[aId].toString('base64');
						xmlBuffers.push(Buffer.from(`<asset id="${aId}">${assetString}</asset>`));
					} else
						xmlBuffers.push(Buffer.from(`<asset id="${aId}">${assetBuffers[aId]}</asset>`));
				}

				for (const id in charBuffers) {
					const buff = charBuffers[id];
					var start = header.length + 9;;
					if (buff.includes('file_name'))
						start = buff.indexOf('.xml', start) + 6;
					const element = buff.subarray(start);
					xmlBuffers.push(Buffer.from(`<cc_char file_name='ugc.char.${id}.xml' ${element}`));
				}

				if (thumb) {
					const thumbString = thumb.toString('base64');
					xmlBuffers.push(Buffer.from(`<thumb>${thumbString}</thumb>`));
				}

				xmlBuffers.push(Buffer.from(`</film>`));
				res(Buffer.concat(xmlBuffers));
			});
		});
	},
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
