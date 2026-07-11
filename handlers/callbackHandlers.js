const { Markup } = require('telegraf');
const { getResults, saveResults } = require('../store/searchStore');
const { getLinkQuery } = require('../store/linkQueryStore');
const { downloadAudio, downloadVideo } = require('../services/downloadService');
const { searchVideos } = require('../services/youtubeService');
const fs = require('fs');

async function handleVideoCallback(ctx) {
  const index = parseInt(ctx.match[1]);
  const videos = await getResults(ctx.from.id);

  if (!videos || !videos[index]) {
    return ctx.answerCbQuery('Bu natija eskirgan, qaytadan qidiring.');
  }

  await ctx.answerCbQuery();

  await ctx.reply(
    'Qanday formatda yuborilsin?',
    Markup.inlineKeyboard([
      [
        Markup.button.callback('🎬 Video (klip)', `format_video_${index}`),
        Markup.button.callback('🎵 Audio', `format_audio_${index}`),
      ],
    ])
  );
}

async function handleFormatCallback(ctx) {
  const type = ctx.match[1];
  const index = parseInt(ctx.match[2]);
  const videos = await getResults(ctx.from.id);

  if (!videos || !videos[index]) {
    return ctx.answerCbQuery('Bu natija eskirgan, qaytadan qidiring.');
  }

  const video = videos[index];
  const uniqueId = `${ctx.from.id}_${Date.now()}`;

  await ctx.answerCbQuery();
  const loadingMsg = await ctx.reply('Yuklab olinmoqda, biroz kuting... ⏳ (bu bir necha soniya vaqt olishi mumkin)');

  try {
    let filePath;

    if (type === 'video') {
      filePath = await downloadVideo(video.url, uniqueId);
      await ctx.replyWithVideo({ source: filePath }, { caption: `🎬 ${video.title}` });
    } else {
      filePath = await downloadAudio(video.url, uniqueId);
      await ctx.replyWithAudio(
        { source: filePath },
        { caption: `🎵 ${video.title}`, title: video.title, performer: video.author.name }
      );
    }

    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
    fs.unlink(filePath, () => {});
  } catch (error) {
    console.error(error);
    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
    await ctx.reply('Yuklab bolmadi 😔 Fayl juda katta bolishi yoki server xatosi bolishi mumkin.');
  }
}


async function handleFindSongCallback(ctx) {
  const linkId = ctx.match[1];
  const query = await getLinkQuery(linkId);

  if (!query) {
    return ctx.answerCbQuery('Bu havola eskirgan, qaytadan yuboring.');
  }

  await ctx.answerCbQuery();
  const loadingMsg = await ctx.reply(`"${query}" asosida qoshiqlar qidirilmoqda... ⏳`);

  try {
    const videos = await searchVideos(query);

    if (videos.length === 0) {
      await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
      return ctx.reply('Afsuski, mos qoshiq topilmadi 😔');
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

    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});

    await ctx.reply(
      `🔎 Topilgan qoshiqlar:\n\n${listText}\n\nQuyidagi raqamlardan birini tanlang:`,
      Markup.inlineKeyboard(buttonRows)
    );
  } catch (error) {
    console.error(error);
    await ctx.deleteMessage(loadingMsg.message_id).catch(() => {});
    await ctx.reply('Xatolik yuz berdi, qaytadan urinib koring.');
  }
}

module.exports = { handleVideoCallback, handleFormatCallback, handleFindSongCallback };