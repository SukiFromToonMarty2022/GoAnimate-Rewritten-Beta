const caché = require('./caché');
const fUtil = require('../fileUtil');
const base = Buffer.alloc(1, 0);
const fs = require('fs');
const movie = require('./main'); 
const numId = fUtil.getLastFileId('movie-', '.xml');

module.exports = function (req, res, url) {
	switch (req.method) {
		case 'GET': {
			const match = req.url.match(/\/movies\/([^.]+)(?:\.(zip|xml))?$/);
			if (!match) return;

			var id = match[1], ext = match[2];
			switch (ext) {
				case 'zip':
					res.setHeader('Content-Type', 'application/zip');
					movie.loadZip(id).then(v => { res.statusCode = 200, res.end(v) })
						.catch(e => { res.statusCode = 404, res.end() })
					break;
				default:
					res.setHeader('Content-Type', 'text/xml');
					movie.loadXml(id).then(v => { res.statusCode = 200, res.end(v) })
						.catch(e => { res.statusCode = 404, res.end() })
			}
			return true;
		}

		case 'POST': {
			if (!url.path.startsWith('/goapi/getMovie/?ut=60&userId=null&movieId=', numId)) return;

			res.setHeader('Content-Type', 'application/zip');
			caché.load(url.query.movieId).then(b => {
				b = Buffer.concat([base, b]);
			res.end(b);
			});
			return true;
		}
		default:
			return;
	}
};
