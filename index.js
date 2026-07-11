const { Telegraf } = require('telegraf');
const mongoose = require('mongoose');
const { BOT_TOKEN, MONGODB_URI } = require('./config');

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB\'ga ulandi ✅'))
  .catch((err) => console.error('MongoDB ulanish xatosi:', err.message));

process.on('unhandledRejection', (reason) => {
  console.error('Ushlanmagan xatolik:', reason.message || reason);
});

const { requireSubscription, handleCheckSubscription } = require('./handlers/subscriptionHandler');
const { handleStart } = require('./handlers/startHandler');
const { handleSearch } = require('./handlers/searchHandler');
const { handleLyrics } = require('./handlers/lyricsHandler');
const { handleVideoCallback, handleFormatCallback, handleFindSongCallback } = require('./handlers/callbackHandlers');

const bot = new Telegraf(BOT_TOKEN, { handlerTimeout: 300000 });
bot.use(requireSubscription);
bot.start(handleStart);


bot.command('lyrics', handleLyrics);
bot.on('text', handleSearch);
bot.action('check_subscription', handleCheckSubscription);
bot.action(/^video_(\d+)$/, handleVideoCallback);
bot.action(/^format_(video|audio)_(\d+)$/, handleFormatCallback);
bot.action(/^findsong_(.+)$/, handleFindSongCallback);

function startBot() {
  bot.launch().catch((err) => {
    console.error('Bot ishga tushishda xatolik:', err.message);
    console.log('5 soniyadan keyin qayta urinib koriladi...');
    setTimeout(startBot, 5000);
  });
}

startBot();

console.log('Bot ishga tushdi...');