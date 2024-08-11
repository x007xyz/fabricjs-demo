<script setup>
  import { NLayout, NLayoutSider, NMenu } from "naive-ui"
import { useRouter } from "vue-router";

  const menuOptions = [
  {
    label: 'fabric播放视频',
    key: '/'
  },
  {
    label: '移除视频绿幕',
    key: '/removeGreen',
  },
  {
    label: '移除视频绿幕（自定义滤镜）',
    key: '/customFilter'
  },
  {
    label: '生成视频缩略图',
    key: '/thumbnail',
  },
  {
    label: '背景抠图',
    key: '/removebg',
  },
  {
    label: '音频波形图',
    key: '/AudioWave',
  }
]

const router = useRouter()

function onClickMenu(path) {
  router.push(path)
}
</script>

<template>
  <n-layout has-sider sider-placement="right" style="position: absolute; inset: 0;">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      :native-scrollbar="false"
      style="max-height: 320px"
    >
      <n-menu
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :on-update:value="onClickMenu"
      />
    </n-layout-sider>
    <n-layout style="height: 100%">
      <router-view></router-view>
    </n-layout>
  </n-layout>
</template>

<style scoped>
</style>
