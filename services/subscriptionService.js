const { REQUIRED_CHANNELS } = require('../config');

async function checkSubscription(bot, userId) {
  const notSubscribed = [];

  for (const channel of REQUIRED_CHANNELS) {
    try {
      const member = await bot.telegram.getChatMember(channel, userId);
      if (['left', 'kicked'].includes(member.status)) {
        notSubscribed.push(channel);
      }
    } catch (error) {
      console.error(`Kanal tekshiruvida xato (${channel}):`, error.message);
      notSubscribed.push(channel);
    }
  }

  return notSubscribed;
}

module.exports = { checkSubscription };