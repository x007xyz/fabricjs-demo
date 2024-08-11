<template>
  <div>
    <input type="file" @change="handleFileUpload" accept="audio/*" />
    <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const canvas = ref(null);
const canvasWidth = 800;  // 画布宽度
const canvasHeight = 200; // 画布高度

let audioContext;
let dataArray;

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const reader = new FileReader();

    reader.onload = function(e) {
      audioContext.decodeAudioData(e.target.result, buffer => {
        dataArray = buffer.getChannelData(0); // 获取左声道数据
        drawRectWaveform();
      });
    };

    reader.readAsArrayBuffer(file);
  }
};

const drawRectWaveform = () => {
  const canvasContext = canvas.value.getContext('2d');

  canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);

  const barWidth = 2;    // 每个矩形的宽度
  const gap = 1;         // 每个矩形之间的间隔
  const step = Math.ceil(dataArray.length / (canvasWidth / (barWidth + gap))); // 采样步长
  let x = 0;

  for (let i = 0; i < dataArray.length; i += step) {
    const v = dataArray[i] * 0.5; // 适当缩放波形高度
    const y = (canvasHeight / 2) + (v * canvasHeight / 2);
    const height = Math.abs(v * canvasHeight); // 矩形高度
    
    canvasContext.fillStyle = 'rgb(0, 0, 255)';
    canvasContext.fillRect(x, canvasHeight / 2 - height / 2, barWidth, height);
    
    x += barWidth + gap;
  }
};
</script>

<style scoped>
canvas {
  border: 1px solid #ccc;
  margin-top: 10px;
}
</style>
