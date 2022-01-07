const loadPost = require("../misc/post_body");
const movie = require("../asset/main");
const http = require("http");

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {string} url
 * @returns {boolean}
 */
module.exports = function (req, res, url) {
	if (req.method != "POST" || (url.path != "/goapi/saveSound/")) return;
	loadPost(req, res).then((data) => {
		var bytes = Buffer.from(data.bytes, "base64");
		movie.save(bytes, data.presaveId, "voiceover", "mp3");
	});
	return true;
};
