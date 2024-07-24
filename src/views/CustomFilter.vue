<template>
  <video id="video" src="../assets/video.mp4" ref="videoRef" loop autoplay crossorigin="anonymous" width="480" height="512"></video>
  <button @click="onPlay">播放视频</button>
  <canvas id="c" ref="canvasRef" width="800" height="800"></canvas>
</template>

<script setup>
  import { ref, onMounted } from "vue"
  import { fabric } from "fabric"
  import "../filters/removegreen"

  const videoRef = ref()
  const canvasRef = ref()

  let video

  onMounted(() => {

    const canvas = new fabric.Canvas('c');

    // fabric.filterBackend = new fabric.Canvas2dFilterBackend()

    videoRef.value.addEventListener('loadeddata', function() {
      video = new fabric.Image(videoRef.value);

      video.filters.push(
        new fabric.Image.filters.RemoveGreen({
          similarity: 0.44,
          smoothness: 0.06,
          spill: 0.02
        }),
      )

      video.applyFilters()
  
      // 也可以使用setElement()方法，将已经加载好的视频元素传入
      
      canvas.add(video);
      
      fabric.util.requestAnimFrame(function render() {
        fabric.filterBackend.evictCachesForKey(video.cacheKey)
        // 应用滤镜
        video.applyFilters()
        // console.log('renderAll')
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