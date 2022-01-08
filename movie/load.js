const caché = require('./caché');
const fUtil = require('./fileUtil');
const base = Buffer.alloc(1, 0);
const fs = require('fs');
const movie = require('./main'); 

module.exports = function (req, res, url) {
	switch (req.method) {
		case 'GET': {
			const match = req.url.match(/\/movies\/([^.]+)(?:\.(zip|xml))?$/);
			if (!match) return;

			var id = match[1], ext = match[2];
			switch (ext) {
				default:
					res.setHeader('Content-Type', 'text/xml');
					movie.loadXml(id).then(v => { res.statusCode = 200, res.end(v) })
						.catch(e => { res.statusCode = 404, res.end() })
			}
			return true;
		}
		case 'POST': {
			// load starters
			const mid = url.query.presaveId;
			if (!url.path.startsWith('/goapi/getMovie/?movieId='`${mid}`'&userId=null&ut=50'))) return;
			const zipF = fUtil.getFileIndex('movie-', '.xml', url.query.movieId);
			res.setHeader('Content-Type', 'application/zip');
			
			caché.load(zipF).then(b => {
				b = Buffer.concat([base, b]);
				res.end(b);
			});
			// load and edit videos
			const vid = url.query.movieId;
			if (!url.path.startsWith("/goapi/getMovie/?movieId="`${vid}`"&userId=null&ut=60"))) return;
			res.setHeader("Content-Type", "application/zip");

			movie
				.loadZip(url.query.movieId)
				.then((b) => res.end(Buffer.concat([base, b])))
				.catch(() => res.end("1"));
			return true;
		}
			
		default:
			return;
	}
};
