import fs from "node:fs";
import path from 'node:path'
import { SpawnProcessBuilder } from "#utils/process.util.mjs";

/**
 * @class Singleton class содержащий методы для работы с ffmpeg
 */
class FfmpegService {
  constructor() {
    const ffmpeg = new SpawnProcessBuilder('ffmpeg')
    ffmpeg
      .add('-hide_banner', '-y')                  // скрыть баннера copyright, libs и т.д.
      .add('-nostats')                            // убрать логи о кадрах
      // .add('-loglevel', 'error')               // логирование только ошибок
      .add('-rtsp_transport', 'tcp')              // передача пакетов по tcp, по умолчанию udp (теряются пакеты часто)
      .add('-use_wallclock_as_timestamps', '1')   // использование системных часов для pts (использовать системное время, а не локальное ffmpeg'a)
      .add('-i', 'rtsp://video:qG4RXkJ3d63t@10.10.17.29:554/cam/realmonitor?channel=1&subtype=0&unicast=true&proto=Onvif')  // входной файл для обработки
      .add('-vcodec', 'copy')                     // скопировать в выходной файл исходный кодек видео (избегаем этапа перекодировки видео)
      .add('-acodec', 'copy')                     // скопировать в выходной файл исходный кодек аудио
      .add('-f', 'segment')                       // указывает формат выходного файла -f
      .add('-reset_timestamps', '1')              // сбрасываем timestamp фреймов каждого сегмента
      .add('-segment_time', '15')                 // время сегмента в секундах
      .add('-segment_format', 'mp4')              // формат выходного файла при сегментации
      .add('-segment_atclocktime', '1')           // сегментация выполняется на основе системного времени
      .add('-strftime', '1')                      // включаем strftime функцию для шаблона имен выходных сегментов
      .add('-pix_fmt', 'yuv420p')                 // указываем цветовое простарнство (формат пикселей)
      .add('./video-stream/%Y-%m-%d-T-%H-%M-%S.mp4', '')  // сохраняем сегменты по пути с именем шаблона
      //.add('-vf', 'select=not(mod(n\\,5))','-vsync', 'vfr','-q:v', '2', 'frame-for-send/output%d.jpeg') // закоменчено т.к. vsync deprecated
      .add('-vf', 'select=not(mod(n\\,5))','-fps_mode', 'vfr','-q:v', '2', 'frame-for-send/output%d.jpeg')  // фильтр для записи каждого n кадра в frame-for-send
    this.ffmpeg = ffmpeg
  }

  /**
   *
   * @param {boolean} logs  по умолчанию true; записывает логи ffmpeg в logs/ffmpeg-logs.txt
   * Метод для начала записи видео-потока
   */
  startRecording(logs = true) {
    this.ffmpeg.run()
    if (logs) {
      const logsPath = path.resolve(process.cwd(), 'logs', 'ffmpeg-logs.txt')
      // ffmpeg пишет все логи по умолчанию в stderr
      this.ffmpeg.child.stderr.pipe(fs.createWriteStream(logsPath, {encoding: 'utf8'}))
    }
  }

  /**
   * Убить процесс ffmpeg
   */
  kill() {
    this.ffmpeg.child.kill()
  }
}


export default new FfmpegService()