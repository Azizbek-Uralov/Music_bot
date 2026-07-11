const SearchResult = require('../models/SearchResult');

async function saveResults(userId, videos) {
  
  await SearchResult.deleteMany({ userId });
  
  await SearchResult.create({ userId, videos });
}

async function getResults(userId) {
  const result = await SearchResult.findOne({ userId }).sort({ createdAt: -1 });
  return result ? result.videos : null;
}

module.exports = { saveResults, getResults };