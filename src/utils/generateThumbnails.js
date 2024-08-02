export const generateThumbnails = async (url, container) => {
  return new Promise((resolve) => {
      // 基于视频元素绘制缩略图，而非解码视频
      const video = document.createElement('video');
      // 静音
      video.muted = true;

      // 绘制缩略图的canvas画布元素
      const offscreenCanvas = new OffscreenCanvas(container.width, container.height);
      const ctx = offscreenCanvas.getContext('2d');

      // 绘制缩略图的标志量
      let isTimeUpdated = false;
      // 几个视频事件
      // 1. 获取视频尺寸
      video.addEventListener('loadedmetadata', () => {
          // 使用视频尺寸计算，缩略图的尺寸，确定需要几张图片和step的值
          const scale = container.height / video.videoHeight;
          const total = Math.ceil(container.width / (video.videoWidth * scale));

          const drawH = video.videoHeight * scale;
          const drawW = video.videoWidth * scale;

          let seekTime = 0.1;
          const interval = (video.duration - seekTime) / total;

          // 开始执行绘制
          draw(interval, drawW, drawH, seekTime);
      });
      // 2. 触发绘制监控
      video.addEventListener('timeupdate', () => {
          isTimeUpdated = true;
      });

      // 请求视频地址，如果是本地文件，直接执行
      if (/^blob:|base64,/i.test(url)) {
          video.src = url;
      } else {
          fetch(url).then(res => res.blob()).then(blob => {
              // 赋予视频
              video.src = URL.createObjectURL(blob);
          });
      }

      // 绘制方法
      const draw = (interval, drawW, drawH, seekTime) => {
          const duration = video.duration;
          let count = 0;
          let currentTime = seekTime + interval * count;

          const loop = () => {
              if (isTimeUpdated && ctx) {
                  // 绘制到指定的位置
                  ctx.drawImage(video, count * drawW, 0, drawW, drawH);
                  count++;
                  currentTime = seekTime + interval * count;

                  if (currentTime > duration) {
                      // 执行完毕
                      resolve(offscreenCanvas.transferToImageBitmap());
                      return;
                  }

                  step();
                  return;
              }
              // 监控状态
              requestAnimationFrame(loop);
          }

          // 逐步绘制，因为currentTime修改生效是异步的
          const step = () => {
              isTimeUpdated = false;
              video.currentTime = currentTime;
              loop();
          }

          step();
      }
  });
}