<script setup>
import RemoveVideoGreen from './views/RemoveVideoGreen.vue'
import ClipVideo from './views/ClipVideo.vue'
import CustomFilter from './views/CustomFilter.vue';

import { ref } from 'vue'

const route = ref('RemoveVideoGreen')
</script>

<template>
  <div>
    <button @click="route = 'RemoveVideoGreen'">绿幕视频</button>
    <button @click="route = 'ClipVideo'">裁剪视频</button>
    <button @click="route = 'CustomFilter'">自定义滤镜</button>
  </div>
  <RemoveVideoGreen v-if="route === 'RemoveVideoGreen'"></RemoveVideoGreen>
  <ClipVideo v-if="route === 'ClipVideo'"></ClipVideo>
  <CustomFilter v-if="route === 'CustomFilter'"></CustomFilter>
</template>

<style scoped>
</style>
