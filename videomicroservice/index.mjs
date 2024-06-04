import { Worker } from "node:worker_threads";
import { resolve } from "node:path";
import { dirname } from "#utils/file-system.util.mjs";
import FfmpegService from "#services/ffmpeg.service.mjs";
import express from 'express'
async function main() {
  try {
    const videoUploadWorker = new Worker(resolve(dirname(import.meta.url), "services", "load-video.service.mjs"));
    FfmpegService.startRecording();
    videoUploadWorker.on("error", err => {
      console.log({ err });
    });
    videoUploadWorker.on("exit", code => {
      console.error({ code });
      FfmpegService.kill();
      process.exit(2);
    });
    const app = express()
    app.use(express.static(resolve(dirname(import.meta.url), 'public')))
    app.listen(8080, () => {
      console.log('Server успешно запущен');
    })
  } catch (e) {
    console.error({ stack: e.stack });
    process.exit(1);
  }
}

await main();
