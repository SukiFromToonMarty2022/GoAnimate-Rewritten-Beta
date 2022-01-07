const movie = require('./movie/main');
const base = Buffer.alloc(1, 0);
const start = '/ajax/';
module.exports = function (req, res, url) {
	if (!url.path.startsWith(start)) return;
	switch (url.path.substr(start.length)) {
		case 'getMovie': {
			if (!url.path.startsWith('/goapi/getMovie/')) return;
			res.setHeader('Content-Type', 'application/zip');

			movie.loadZip(url.query.movieId).then(b =>
				res.end(Buffer.concat([base, b]))
			).catch(e => res.end('1'));
			return true;
		}
		default: {
			res.end();
			return false;
		};
	}
	res.end();
	return true;
}
