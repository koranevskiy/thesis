import fs from "node:fs";
import path from "node:path";
import Config from "#config/index.mjs";
import { dirname, isFileWritingNow } from "#utils/file-system.util.mjs";
import S3 from "#utils/s3.util.mjs";

await S3.initS3(Config.s3);
// const job = new CronJob(Config.loadVideo.loadCronTime, loadVideosToS3, null, true)

async function loadVideosToS3() {
  const curDirPath = dirname(import.meta.url);
  const videoDirPath = path.resolve(curDirPath, "..", "video-stream");
  const dirFilesPath = fs
    .readdirSync(videoDirPath, { withFileTypes: true })
    .filter(file => !file.name.startsWith("."))
    .map(file => ({
      path: path.resolve(videoDirPath, file.name),
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
        fs.unlinkSync(filePath);
      }
    }
    prevFile = filename;
  });
}

loadVideosToS3();
