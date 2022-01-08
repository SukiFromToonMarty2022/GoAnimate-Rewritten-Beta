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
const caché = require('../data/caché');
var cache = {}, filePath;


function generateId() {
	var id;
	do id = ('' + Math.random()).replace('.', '');
	while (cache[id]);
	return id;
}

async function unpackMovie(zipFile, thumb = null, assetBuffers = null) {
	return new Promise((res) => {
		var pieces = [];
		var stream = zipFile["movie.xml"].toReadStream();
		stream.on("data", (b) => pieces.push(b));
		stream.on("end", async () => {
			var mainSlice = Buffer.concat(pieces).slice(0, -7);
			var xmlBuffers = [];
			var charBuffers = {};
			var assetRemap = {};

			// Remaps UGC asset IDs to match the current Wrapper environment.
			for (let c = 0, end; ; c = mainSlice.indexOf("ugc.", c) + 4) {
				if (c == 0) continue;
				else if (c == 3) {
					xmlBuffers.push(mainSlice.subarray(end));
					break;
				}

				xmlBuffers.push(mainSlice.subarray(end, c));
				end = mainSlice.indexOf("<", c + 1);
				var assetId = mainSlice.subarray(c, end).toString();
				var index = assetId.indexOf("-");
				var prefix = assetId.substr(0, index);
				switch (prefix) {
					case "c": {
						var t = new Date().getTime();
						var dot = assetId.indexOf(".");
						var charId = assetId.substr(0, dot);
						var saveId = assetRemap[charId];
						if (!assetRemap[charId]) {
							saveId = assetRemap[charId] = `C-${~~(1e4 * Math.random())}-${t}`;
						}

						var remainder = assetId.substr(dot);
						xmlBuffers.push(Buffer.from(saveId + remainder));
						try {
							charBuffers[saveId] = await char.load(charId);
						} catch (e) {}
						break;
					}
					case "C": {
						var dot = assetId.indexOf(".");
						var charId = assetId.substr(0, dot);
						charBuffers[charId] = await char.load(charId);
						xmlBuffers.push(Buffer.from(assetId));
						break;
					}
					default: {
						xmlBuffers.push(Buffer.from(assetId));
						break;
					}
				}
			}

			// Appends base-64 encoded assets into XML.
			if (assetBuffers)
				for (let aId in assetBuffers) {
					var dot = aId.lastIndexOf(".");
					var dash = aId.lastIndexOf("-");
					//var mode = aId.substr(dash + 1, dot - dash - 1);

					if (useBase64(aId)) {
						var assetString = assetBuffers[aId].toString("base64");
						xmlBuffers.push(Buffer.from(`<asset id="${aId}">${assetString}</asset>`));
					} else xmlBuffers.push(Buffer.from(`<asset id="${aId}">${assetBuffers[aId]}</asset>`));
				}

			var hLen = header.length;
			for (let id in charBuffers) {
				var buff = charBuffers[id];
				var hasHeader = buff.subarray(0, hLen / 2).toString() == header.substr(0, hLen / 2);
				var start = buff.includes("file_name") ? buff.indexOf(".xml") + 6 : hasHeader ? hLen + 9 : 9;
				xmlBuffers.push(Buffer.from(`<cc_char file_name='ugc.char.${id}.xml' x${buff.subarray(start)}`));
			}

			if (thumb) {
				var thumbString = thumb.toString("base64");
				xmlBuffers.push(Buffer.from(`<thumb>${thumbString}</thumb>`));
			}

			xmlBuffers.push(Buffer.from(`</film>`));
			res(Buffer.concat(xmlBuffers));
		});
	});
}
module.exports = {
	load(path) {
		if (!fs.existsSync(path))
			return Promise.reject();
		cache = {}, filePath = path;
		const zip = nodezip.create();
		return unpackMovie(zip, fs.readFileSync(path));
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
