const { Markup } = require('telegraf');
const { searchVideos } = require('../services/youtubeService');
const { saveResults } = require('../store/searchStore');
const { handleLink, isSocialLink } = require('./linkHandler');

async function handleSearch(ctx) {
  const query = ctx.message.text;

  if (query.startsWith('/')) return;

  if (isSocialLink(query)) {
    return handleLink(ctx);
  };
  const searchingMsg = await ctx.reply(`"${query}" qidirilmoqda... ⏳`);

  try {
    const videos = await searchVideos(query);

    if (videos.length === 0) {
      await ctx.deleteMessage(searchingMsg.message_id);
      return ctx.reply('Afsuski, hech narsa topilmadi 😔');
    }

    await saveResults(ctx.from.id, videos);

    const listText = videos
      .map((video, index) => `${index + 1}. ${video.title} (${video.timestamp})`)
      .join('\n');

    const numberButtons = videos.map((_, index) =>
      Markup.button.callback(`${index + 1}`, `video_${index}`)
    );

    const buttonRows = [];
    for (let i = 0; i < numberButtons.length; i += 5) {
      buttonRows.push(numberButtons.slice(i, i + 5));
    }

    await ctx.deleteMessage(searchingMsg.message_id);

    await ctx.reply(
      `🔎 Natijalar:\n\n${listText}\n\nQuyidagi raqamlardan birini tanlang:`,
      Markup.inlineKeyboard(buttonRows)
    );
  } catch (error) {
    console.error(error);
    await ctx.deleteMessage(searchingMsg.message_id).catch(() => {});
    await ctx.reply('Xatolik yuz berdi, qaytadan urinib koring.');
  }
}

module.exports = { handleSearch };
