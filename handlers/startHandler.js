async function handleStart(ctx) {
  await ctx.reply(
    '🎵 MUSIQA BOTI — bir joyda hammasi!\n\n' +
    'Endi qoshiq qidirish uchun bir necha ilova ochish shart emas!\n\n' +
    '✅ Qoshiq yoki ijrochi nomini yozing\n' +
    '   → YouTube\'dan 10 ta variant chiqadi\n' +
    '   → Video yoki Audio holida yuklab oling\n\n' +
    '✅ Qoshiq matni kerakmi?\n' +
    '   → /lyrics Ijrochi - Qoshiq\n' +
    '   → Matnni topib beraman\n\n' +
    '✅ Instagram, YouTube, Facebook yoki Pinterest\'dan\n' +
    '   yoqqan videoni topdingizmi?\n' +
    '   → Havolasini yuboring\n' +
    '   → Videoni yuklab beraman\n' +
    '   → Undagi musiqani ham topib beraman 🎶\n\n' +
    'Bepul, cheklovsiz, oddiy!\n' +
    'Shunchaki botga yozing va sinab koring 👇' +

    't.me/music_finder_new_bot'
  );
}

module.exports = { handleStart };