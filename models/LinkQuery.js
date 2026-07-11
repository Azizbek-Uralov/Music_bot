const mongoose = require('mongoose');

const linkQuerySchema = new mongoose.Schema({
  linkId: { type: String, required: true, unique: true },
  query: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 3600 },
});

module.exports = mongoose.model('LinkQuery', linkQuerySchema);