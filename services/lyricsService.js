async function getLyrics(artist, song) {
  const response = await fetch(
    `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`
  );
  const data = await response.json();
  return data.lyrics || null;
}

module.exports = { getLyrics };