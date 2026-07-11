const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const DOWNLOAD_DIR = path.join(__dirname, '..', 'downloads');

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

function downloadAudio(url, id) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DOWNLOAD_DIR, `${id}.mp3`);
    const command = `yt-dlp -x --audio-format mp3 -o "${filePath}" "${url}"`;

    exec(command, (error) => {
      if (error) return reject(error);
      resolve(filePath);
    });
  });
}

function downloadVideo(url, id) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DOWNLOAD_DIR, `${id}.mp4`);
    const command = `yt-dlp -f "best[ext=mp4][height<=720]" -o "${filePath}" "${url}"`;

    exec(command, (error) => {
      if (error) return reject(error);
      resolve(filePath);
    });
  });
}

function downloadFromLink(url, id) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DOWNLOAD_DIR, `${id}.mp4`);
    const command = `yt-dlp --cookies-from-browser firefox --socket-timeout 60 -f "bv*+ba/best" --merge-output-format mp4 -o "${filePath}" "${url}"`;

    exec(command, (error) => {
      if (error) return reject(error);
      resolve(filePath);
    });
  });
}

function getVideoInfo(url) {
  return new Promise((resolve, reject) => {
    const command = `yt-dlp --cookies-from-browser firefox --skip-download --print "%(track)s|||%(artist)s|||%(title)s|||%(uploader)s" "${url}"`;

    exec(command, (error, stdout) => {
      if (error) return reject(error);

      const [track, artist, title, uploader] = stdout.trim().split('|||').map(s => (s === 'NA' ? '' : s));

      let query = null;

      if (track && artist) {
        query = `${artist} ${track}`;
      } else if (track) {
        query = track;
      } else if (title && !/^video by /i.test(title)) {
        // Faqat generik "Video by ..." bo'lmasa, sarlavhani ishlatamiz
        query = title;
      }

      resolve({ query });
    });
  });
}

module.exports = { downloadAudio, downloadVideo, downloadFromLink, getVideoInfo };