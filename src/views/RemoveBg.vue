<template>
  <div>
    <n-flex style="padding: 12px;">
      <n-space style="width: 250px;">
        <n-radio
          v-for="option in options"
          :key="option.label"
          :checked="checkedValue === option.label"
          :value="option.label"
          @change="handleChange"
        >
          {{ option.label }}
        </n-radio>
        <img style="width: 240px;" :src="options.find(option => option.label === checkedValue)?.image" alt="" ref="sourceRef">
      </n-space>
      <n-space vertical>
        <n-button @click="onRemoveBg01">抠图方式01</n-button>
        <n-button @click="onRemoveBg02">抠图方式02</n-button>
        <n-button>抠图方式03</n-button>
      </n-space>
      <div style="width: 240px;height: 360px;border: 1px solid #ccc;margin-top: 32px;">
        <canvas id="c" width="240" height="360"></canvas>
      </div>
    </n-flex>
  </div>
</template>

<script setup lang="ts">
import { NSpace, NButton, NRadio, NFlex } from "naive-ui"
import BgImage from "../assets/bg.jpg"
import BgImage01 from "../assets/bg01.png"
import BgImage02 from "../assets/bg02.png"
import { ref, onMounted } from "vue"
import { fabric } from "fabric"
import "../filters/removegreen"


const sourceRef = ref()

const options = [{
  label: '图片01',
  image: BgImage01
}, {
  label: '图片02',
  image: BgImage02,
}, {
  label: '图片',
  image: BgImage
}]

const checkedValue = ref('图片01')

function handleChange(e) {
  checkedValue.value = e.target.value
}

let canvas

onMounted(() => {
  canvas = new fabric.Canvas('c');
})

function onRemoveBg01() {
  canvas && canvas.clear()
  const img = new fabric.Image(sourceRef.value);

  img.filters.push(
    new fabric.Image.filters.RemoveColor({
        distance: 0.4,
        color: '#00FF00',
    }),
  )

  img.applyFilters()

  // 也可以使用setElement()方法，将已经加载好的视频元素传入

  canvas.add(img);
}

function onRemoveBg02() {
  canvas && canvas.clear()

  const img = new fabric.Image(sourceRef.value);

  img.filters.push(
    new fabric.Image.filters.RemoveGreen({
      similarity: 0.4,
      smoothness: 0.02,
      spill: 0.1
    }),
  )

  img.applyFilters()

  // 也可以使用setElement()方法，将已经加载好的视频元素传入

  canvas.add(img);
}
</script>

<style scoped>

</style>