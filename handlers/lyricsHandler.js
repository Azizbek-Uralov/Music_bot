const { Markup } = require('telegraf');
const { getLyrics } = require('../services/lyricsService');

async function handleLyrics(ctx) {
  const text = ctx.message.text.replace('/lyrics', '').trim();

  if (!text.includes('-')) {
    return ctx.reply('Iltimos, shu formatda yozing:\n/lyrics Ijrochi - Qoshiq nomi');
  }

  const [artist, song] = text.split('-').map(s => s.trim());

  await ctx.reply(`"${song}" matni qidirilmoqda... ⏳`);

  try {
    const lyrics = await getLyrics(artist, song);

    if (lyrics) {
      const lyricsText = lyrics.length > 4000 ? lyrics.slice(0, 4000) + '...' : lyrics;
      await ctx.reply(`🎤 *${artist} - ${song}*\n\n${lyricsText}`, { parse_mode: 'Markdown' });
    } else {
      const searchQuery = encodeURIComponent(`${artist} ${song} qo'shiq matni`);
      const googleUrl = `https://www.google.com/search?q=${searchQuery}`;

      await ctx.reply(
        `Afsuski, bu qoshiq matni bazamizda topilmadi 😔\n\nLekin quyidagi tugma orqali qidirib topishingiz mumkin:`,
        Markup.inlineKeyboard([
          Markup.button.url('🔍 Google orqali qidirish', googleUrl),
        ])
      );
    }
  } catch (error) {
    console.error(error);
    await ctx.reply('Xatolik yuz berdi, qaytadan urinib koring.');
  }
}

module.exports = { handleLyrics };