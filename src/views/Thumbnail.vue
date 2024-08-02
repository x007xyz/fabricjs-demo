<template>
  <n-space vertical>
    <n-input v-model:value="url" type="text" placeholder="视频地址" />
    <div>
      1. 视频需要支持跨域<br/>
      2. 视频需要能够正常播放
    </div>
    <n-button @click="genThumbnail1">生成缩略图（方式1）</n-button>
    生成耗时：{{ duration01 || '-' }}ms
    <div class="wrapper01" ref="wrapper01Ref">
      <img v-for="img in imgs" :src="img" alt="">
    </div>
    <n-button @click="genThumbnail2">生成缩略图（方式2）</n-button>
    生成耗时：{{ duration02 || '-' }}ms
    <div class="wrapper02">
      <canvas ref="wrapper02Ref"></canvas>
    </div>
  </n-space>
</template>

<script setup>
import { NSpace, NButton, NInput } from "naive-ui"
import { ref, onMounted } from "vue"
import { generateThumbnails } from "../utils/generateThumbnails";
import { handleGetVideoThumb } from "../utils/handleGetVideoThumb";

const url = ref('https://bilibili.github.io/WebAV/video/bunny.mp4')

const wrapper01Ref = ref()
const wrapper02Ref = ref()

let width = 0
let height = 0

onMounted(() => {
  const rect = wrapper02Ref.value.getBoundingClientRect()
  width = rect.width
  height = rect.height
})

const duration01 = ref(0)
const duration02 = ref(0)

const imgs = ref([])
function genThumbnail1() {
  duration01.value = 0
  const start = performance.now()
  handleGetVideoThumb(url.value, {
    width, height,
    onFinish (res) {
      duration01.value = performance.now() - start
      imgs.value = res
    }
  })
}


function genThumbnail2() {
  duration02.value = 0
  const start = performance.now()
  generateThumbnails(url.value, {width, height}).then((bitmap) => {
    duration02.value = performance.now() - start
    wrapper02Ref.value.getContext("bitmaprenderer")?.transferFromImageBitmap(bitmap)
  })
}

</script>

<style lang="css" scoped>
.wrapper01, .wrapper02 {
  height: 80px;
  width: calc(100% - 24px);
  background-color: #f0f0f0;
  margin: 0 12px;
  display: flex;
  overflow: hidden;
}
canvas {
  width: 100%;
  height: 100%;
}
</style>