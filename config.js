const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  MONGODB_URI: process.env.MONGODB_URI,
  REQUIRED_CHANNELS: process.env.REQUIRED_CHANNELS
    ? process.env.REQUIRED_CHANNELS.split(',').map(c => c.trim())
    : [],
};