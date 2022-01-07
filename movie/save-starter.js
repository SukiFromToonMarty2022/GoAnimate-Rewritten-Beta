const loadPost = require('../request/post_body');
const movie = require('./callMovie');

module.exports = function (req, res, url) {
	if (req.method != 'POST' || url.path != '/goapi/saveTemplate/') return;
	loadPost(req, res).then(data => {
		if (data.is_triggered_by_autosave && data.noAutosave)
			return res.end('0');
		var id = data.movieId || data.presaveId;
		var body = Buffer.from(data.body_zip, 'base64');
		var thumb = data.thumbnail_large &&
			Buffer.from(data.thumbnail_large, 'base64');
		movie.save(body, thumb, id).then(nId => res.end('0' + nId));
	});
	return true;
}
