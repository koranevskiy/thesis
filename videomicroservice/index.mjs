import Config from '#config/index.mjs'
import { Worker } from 'node:worker_threads'
import { resolve } from 'node:path'
import { SpawnProcessBuilder } from '#utils/process.util.mjs'
import S3 from '#utils/s3.util.mjs'
import { dirname } from '#utils/file-system.util.mjs'



function startVideoRecording() {
  const ffmpeg = new SpawnProcessBuilder('ffmpeg')
  ffmpeg
    .add('-hide_banner', '-y')
    .add('-loglevel', 'error')
    .add('-rtsp_transport', 'tcp')
    .add('-use_wallclock_as_timestamps', '1')
    .add('-i', 'rtsp://video:qG4RXkJ3d63t@10.10.17.29:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif')
    .add('-vcodec', 'copy')
    .add('-acodec', 'copy')
    .add('-f', 'segment')
    .add('-reset_timestamps', '1')
    .add('-segment_time', '15')
    .add('-segment_format', 'mp4')
    .add('-segment_atclocktime', '1')
    .add('-strftime', '1')
    .add('-pix_fmt', 'yuv420p')
    .add('./video-stream/%Y-%m-%d-T-%H-%M-%S.mp4', '')
    .add('-vf', 'select=not(mod(n\\,5))','-vsync', 'vfr','-q:v', '2', 'frame-for-send/output%d.jpeg')

  ffmpeg.run()
  ffmpeg.on('data', data => {
    console.log({
      stream: 'data',
      message: data.toString('utf8')
    })
  })

  ffmpeg.onError('data', data => {
    console.error({
      stream: 'error',
      message: data.toString('utf8')
    })
  })

  return ffmpeg
}

async function main() {
  try {
    const videoUploadWorker = new Worker(resolve(dirname(import.meta.url), 'services', 'load-video.service.mjs'))

    const ffmpeg = startVideoRecording()
    videoUploadWorker.on('error', err => {
      console.log({err})
    })
    videoUploadWorker.on('exit', code => {
      console.error({code})
      ffmpeg.child.kill()
      process.exit(2)
    })
  }catch (e) {
    console.error({stack: e.stack})
    process.exit(1)
  }
}

await main()

