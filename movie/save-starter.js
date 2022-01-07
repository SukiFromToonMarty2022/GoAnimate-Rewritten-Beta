const loadPost = require('../request/post_body');
const starter = require('./callMovie');

module.exports = function (req, res, url) {
	if (req.method != 'POST' || url.path != '/goapi/saveTemplate/') return;
	loadPost(req, res).then(data => {
		var id = data.movieId || data.presaveId;
		var body = Buffer.from(data.body_zip, 'base64');
		starter.save(body, id).then(() => res.end('0' + id));
	});
	return true;
}
