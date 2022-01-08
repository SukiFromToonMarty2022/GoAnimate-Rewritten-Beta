const movie = require('./main');
const base = Buffer.alloc(1, 0);
module.exports = {
  loadVideo(url, res) {
    if (!url.path.startsWith('/goapi/getMovie/')) return;
    res.setHeader('Content-Type', 'application/zip');
    movie.loadZip(url.query.movieId).then(b =>
                                          res.end(Buffer.concat([base, b]))
                                         ).catch(e => res.end('1'));
    return true;
  }
}
