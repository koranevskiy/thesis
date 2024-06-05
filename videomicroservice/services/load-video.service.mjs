import fs from "node:fs";
import path from "node:path";
import Config from "#config/index.mjs";
import { dirname, isFileWritingNow } from "#utils/file-system.util.mjs";
import S3 from "#utils/s3.util.mjs";
// import cron from "node-cron";
import axios from 'axios'

await S3.initS3(Config.s3);

async function loadVideosToS3() {
  const curDirPath = dirname(import.meta.url);
  const videoDirPath = path.resolve(curDirPath, "..", "video-stream");
  const dirFilesPath = fs
    .readdirSync(videoDirPath, { withFileTypes: true })
    .filter(file => !file.name.startsWith("."))
    .map(file => ({
      path: path.resolve(videoDirPath, file.name)
    }))
    .filter(file => !isFileWritingNow(file.path));
  if (dirFilesPath.length) {
    await S3.putObjectsFile(dirFilesPath);
    dirFilesPath.forEach(file => fs.unlinkSync(file.path));
  }

  await new Promise(res => setTimeout(res, 100));

  let prevFile = null;
  const filePair = [];
  fs.watch(videoDirPath, async (eventType, filename) => {
    if (filename !== prevFile && prevFile) {
      let isNeedDeleteFile = true;
      if (filePair.length) {
        const [prev_prevFile, prev_file] = filePair.pop();
        if (prev_prevFile === filename && prev_file === prev_file) isNeedDeleteFile = false;
      }
      filePair.push([prevFile, filename]);
      if (isNeedDeleteFile) {
        const filePath = path.resolve(videoDirPath, prevFile);
        await S3.putObjectsFile([{ path: filePath }]);
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
        }
      }
    }
    prevFile = filename;
  });
}

loadVideosToS3();


let cronInstance = null;

async function processFrames() {
  // cronInstance = cron.schedule("* * * * * *", toDetector);

  try {
    const curDirPath = dirname(import.meta.url);
    const framesDir = path.resolve(curDirPath, "..", "frame-for-send");
    const dirFilesPath = fs
      .readdirSync(framesDir, { withFileTypes: true })
      .filter(file => !file.name.startsWith("."))
      .map(file => ({
        path: path.resolve(framesDir, file.name)
      }))
      .filter(file => !isFileWritingNow(file.path));

    for (const {path: filePath} of dirFilesPath) {
      const base64Image = fs.readFileSync(filePath).toString('base64')

      const { data } = await axios.post(`${Config.proxyUrl}/detect`, {
        uuid: Config.cameraUuid,
        image: base64Image
      })
      await axios.post(`${Config.proxyUrl}/webmain/detectors/event`, {
        camera_uuid: Config.cameraUuid,
        annotated_image: data.annotated_image,
        original_image: base64Image,
        detections: data.detections,
        event_text: data.event_text
      })
      fs.unlinkSync(filePath)
    }
  } catch (e) {
    console.log(e);
  } finally {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    processFrames()
  }

}

processFrames();

// async function toDetector() {
//   cronInstance.stop();
//   try {
//     const curDirPath = dirname(import.meta.url);
//     const framesDir = path.resolve(curDirPath, "..", "frame-for-send");
//     const dirFilesPath = fs
//       .readdirSync(framesDir, { withFileTypes: true })
//       .filter(file => !file.name.startsWith("."))
//       .map(file => ({
//         path: path.resolve(framesDir, file.name)
//       }))
//       .filter(file => !isFileWritingNow(file.path));
//
//     for (const {path: filePath} of dirFilesPath) {
//       const base64Image = fs.readFileSync(filePath).toString('base64')
//
//       const { data } = await axios.post(`${Config.proxyUrl}/detect`, {
//         uuid: Config.cameraUuid,
//         image: base64Image
//       })
//       await axios.post(`${Config.proxyUrl}/webapp/detectors/event`, {
//         camera_uuid: Config.cameraUuid,
//         annotated_image: data.annotated_image,
//         original_image: base64Image,
//         detections: data.detections,
//         event_text: data.event_text
//       })
//       fs.unlinkSync(filePath)
//     }
//   } catch (e) {
//     console.log(e);
//   } finally {
//     cronInstance.start();
//   }
//
// }