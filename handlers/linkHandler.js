const { Markup } = require('telegraf');
const { downloadFromLink, getVideoInfo } = require('../services/downloadService');
const { saveLinkQuery } = require('../store/linkQueryStore');
const fs = require('fs');

function isSocialLink(text) {
  return /instagram\.com|youtube\.com|youtu\.be|pinterest\.com|pin\.it|facebook\.com|fb\.watch/i.test(text);
}


async function handleLink(ctx) {
  const url = ctx.message.text.trim();
  const uniqueId = `${ctx.from.id}_${Date.now()}`;

  const loadingMsg = await ctx.reply('Havoladan yuklab olinmoqda, biroz kuting... ⏳');

  try {
    const [filePath, info] = await Promise.all([
    downloadFromLink(url, uniqueId),
    getVideoInfo(url).catch(() => ({ query: null })),
  ]);

    if (info.query) {
    await saveLinkQuery(uniqueId, info.query);

    await ctx.replyWithVideo(
      { source: filePath },
      Markup.inlineKeyboard([
      Markup.button.callback('🎵 Qoshiqni topish', `findsong_${uniqueId}`),
      ])
    );
  } else {
    await ctx.replyWithVideo({ source: filePath });
  }

    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
    fs.unlink(filePath, () => {});
  } catch (error) {
    console.error(error);
    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
    await ctx.reply('Yuklab bolmadi 😔 Havola notogri bolishi yoki video ochiq bolmasligi mumkin.');
  }
}

module.exports = { handleLink, isSocialLink };