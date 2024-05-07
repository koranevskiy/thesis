import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs'


function dirname(fileUrl) {
  return path.dirname(url.fileURLToPath(fileUrl))
}

function isFileWritingNow(filePath) {
  try {
    fs.renameSync(filePath, filePath)
    return false
  }catch (e) {
    return true
  }
}


export {
  dirname,
  isFileWritingNow
}