export const handleGetVideoThumb = function (url, options = {}) {
  if (typeof url != 'string') {
      return;
  }
  // 默认参数
  const defaults = {
      onLoading: () => {},
      onLoaded: () => {},
      onFinish: (arr) => {}
  };

  const params = Object.assign({}, defaults, options);

  // 基于视频元素绘制缩略图，而非解码视频
  const video = document.createElement('video');
  // 静音
  video.muted = true;

  // 绘制缩略图的canvas画布元素
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d', {
      willReadFrequently: true
  });

  // 绘制缩略图的标志量
  let isTimeUpdated = false;
  // 几个视频事件
  // 1. 获取视频尺寸
  video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const scale = params.height / video.videoHeight;
      const total = Math.ceil(params.width / (video.videoWidth * scale));

      const interval = (video.duration - 0.1) / total;

      // 开始执行绘制
      draw(interval);
  });
  // 2. 触发绘制监控
  video.addEventListener('timeupdate', () => {
      isTimeUpdated = true;
  });

  // 获取视频数据
  params.onLoading();
  // 请求视频地址，如果是本地文件，直接执行
  if (/^blob:|base64,/i.test(url)) {
      video.src = url;
  } else {
      fetch(url).then(res => res.blob()).then(blob => {
          params.onLoaded();
          // 赋予视频
          video.src = URL.createObjectURL(blob);
      });
  }

  // 绘制方法
  const draw = (interval) => {
      const arrThumb = [];
      const duration = video.duration;
      let seekTime = 0.1;

      const loop = () => {
          if (isTimeUpdated) {
              context.clearRect(0, 0, canvas.width, canvas.height);
              context.drawImage(video, 0, 0, canvas.width, canvas.height);

              canvas.toBlob(blob => {
                  arrThumb.push(URL.createObjectURL(blob));

                  seekTime += interval;

                  if (seekTime > duration) {
                      params.onFinish(arrThumb);

                      return;
                  }

                  step();
              }, 'image/jpeg');

              return;
          }
          // 监控状态
          requestAnimationFrame(loop);
      }

      // 逐步绘制，因为currentTime修改生效是异步的
      const step = () => {
          isTimeUpdated = false;
          video.currentTime = seekTime;

          loop();
      }

      step();
  }
};