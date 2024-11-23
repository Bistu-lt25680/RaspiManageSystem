<template>
  <div class="surveillance-container">
    <img :src="videoStreamUrl" alt="视频流" crossorigin="anonymous" />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { raspiurl } from '../../../../url';

const videoStreamUrl = computed(() => {
  return `http://localhost:3000/proxy/video-stream`;
});
</script>

<style scoped>
.surveillance-container {
  text-align: center;
}

img {
  width: 640px;
  height: 480px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>