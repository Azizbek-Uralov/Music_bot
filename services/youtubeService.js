const yts = require('yt-search');

async function searchVideos(query, limit = 10) {
  const result = await yts(query);
  return result.videos.slice(0, limit);
}

module.exports = { searchVideos };