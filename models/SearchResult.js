const mongoose = require('mongoose');

const searchResultSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  videos: { type: Array, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

module.exports = mongoose.model('SearchResult', searchResultSchema);