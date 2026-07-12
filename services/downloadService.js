const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cookiesPath = path.join(__dirname, '..', 'cookies.txt');

if (process.env.COOKIES_CONTENT && !fs.existsSync(cookiesPath)) {
  fs.writeFileSync(cookiesPath, process.env.COOKIES_CONTENT);
}

const DOWNLOAD_DIR = path.join(__dirname, '..', 'downloads');

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR);
}

function downloadAudio(url, id) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DOWNLOAD_DIR, `${id}.mp3`);
    const command = `yt-dlp --cookies "${cookiesPath}" --extractor-args "youtube:player_client=android" -x --audio-format mp3 -o "${filePath}" "${url}"`;

    exec(command, (error) => {
      if (error) return reject(error);
      resolve(filePath);
    });
  });
}

function downloadVideo(url, id) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DOWNLOAD_DIR, `${id}.mp4`);
    const command = `yt-dlp --cookies "${cookiesPath}" --extractor-args "youtube:player_client=android" -f "best[ext=mp4][height<=480]" --max-filesize 45M -o "${filePath}" "${url}"`;

    exec(command, (error) => {
      if (error) return reject(error);
      resolve(filePath);
    });
  });
}

function downloadFromLink(url, id) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(DOWNLOAD_DIR, `${id}.mp4`);
    const command = `yt-dlp --cookies "${cookiesPath}" -N 8 --socket-timeout 60 -f "bv*[height<=480]+ba/best[height<=480]/best" --max-filesize 45M --merge-output-format mp4 -o "${filePath}" "${url}"`;

    exec(command, (error) => {
      if (error) return reject(error);
      resolve(filePath);
    });
  });
}

function getVideoInfo(url) {
  return new Promise((resolve, reject) => {
    const command = `yt-dlp --cookies "${cookiesPath}" --skip-download --print "%(track)s|||%(artist)s|||%(title)s|||%(uploader)s" "${url}"`;

    exec(command, (error, stdout) => {
      if (error) return reject(error);

      const [track, artist, title, uploader] = stdout.trim().split('|||').map(s => (s === 'NA' ? '' : s));

      let query = null;

      if (track && artist) {
        query = `${artist} ${track}`;
      } else if (track) {
        query = track;
      } else if (title && !/^video by /i.test(title)) {
        query = title;
      }

      resolve({ query });
    });
  });
}

module.exports = { downloadAudio, downloadVideo, downloadFromLink, getVideoInfo };