const { Markup } = require('telegraf');
const { checkSubscription } = require('../services/subscriptionService');

async function requireSubscription(ctx, next) {
  const notSubscribed = await checkSubscription(ctx.telegram, ctx.from.id);

  if (notSubscribed.length === 0) {
    return next();
  }

  const buttons = notSubscribed.map((channel) => [
    Markup.button.url(`📢 ${channel}`, `https://t.me/${channel.replace('@', '')}`),
  ]);

  buttons.push([Markup.button.callback('✅ Tekshirish', 'check_subscription')]);

  await ctx.reply(
    'Botdan foydalanish uchun avval quyidagi kanal(lar)ga obuna bolishingiz kerak:',
    Markup.inlineKeyboard(buttons)
  );
}

async function handleCheckSubscription(ctx) {
  const notSubscribed = await checkSubscription(ctx.telegram, ctx.from.id);

  if (notSubscribed.length === 0) {
    await ctx.answerCbQuery('Rahmat! Endi botdan foydalanishingiz mumkin ✅');
    await ctx.deleteMessage().catch(() => {});
  } else {
    await ctx.answerCbQuery('Siz hali hammasiga obuna bolmagansiz 😔', { show_alert: true });
  }
}

module.exports = { requireSubscription, handleCheckSubscription };