<template>
  <video id="video" src="../assets/video.mp4" ref="videoRef" loop autoplay crossorigin="anonymous" width="480" height="512" muted></video>
  <button @click="onPlay">播放视频</button>
  <canvas id="c" ref="canvasRef" width="800" height="800"></canvas>
</template>

<script setup>
  import { ref, onMounted } from "vue"
  import { fabric } from "fabric"

  const videoRef = ref()
  const canvasRef = ref()

  let video

  onMounted(() => {

    const canvas = new fabric.Canvas('c');

    videoRef.value.addEventListener('loadeddata', function() {
      video = new fabric.Image(videoRef.value);
  
      // 也可以使用setElement()方法，将已经加载好的视频元素传入

      // 裁剪边框
      // 定义裁剪区域，这里我们设置裁剪区域比原始图片小4px
      var clipPath = new fabric.Rect({
        absolutePositioned: true,
        left: 40, // 裁剪区域左边界
        top: 40, // 裁剪区域上边界
        width: video.width - 80, // 裁剪区域宽度，减去两倍边框宽度
        height: video.height - 80, // 裁剪区域高度，减去两倍边框高度
        fill: 'white',
      })

      video.clipPath = clipPath
      
      canvas.add(video);
      
      fabric.util.requestAnimFrame(function render() {
        canvas.renderAll();
        fabric.util.requestAnimFrame(render);
      });
      // 视频正常加载后，再生成 fabric.Image 对象
    });
  })

  function onPlay() {
    videoRef.value.play()
  }
</script>

<style lang="scss" scoped>

</style>