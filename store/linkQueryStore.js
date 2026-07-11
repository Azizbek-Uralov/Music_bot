const LinkQuery = require('../models/LinkQuery');

async function saveLinkQuery(linkId, query) {
  await LinkQuery.create({ linkId, query });
}

async function getLinkQuery(linkId) {
  const result = await LinkQuery.findOne({ linkId });
  return result ? result.query : null;
}

module.exports = { saveLinkQuery, getLinkQuery };