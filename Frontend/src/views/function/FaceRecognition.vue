<template>
  <div class="container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>人脸识别</span>
          <div class="button-group">
            <el-button type="primary" @click="startCamera" :disabled="isStreaming">
              开启摄像头
            </el-button>
            <el-button type="success" @click="startRecognition" :disabled="!isStreaming">
              开始识别
            </el-button>
            <el-button type="danger" @click="stopCamera" :disabled="!isStreaming">
              关闭摄像头
            </el-button>
          </div>
        </div>
      </template>
      
      <div class="content-container">
        <div class="camera-container">
          <img 
            v-if="isStreaming"
            :src="videoStreamUrl" 
            alt="视频流" 
            ref="videoStream"
            class="video-stream"
            crossorigin="anonymous"
          />
          <img 
            v-if="!isStreaming && lastFrame"
            :src="lastFrame"
            alt="最后一帧"
            class="video-stream"
          />
          <canvas ref="canvasOutput" style="display: none;"></canvas>
          <div v-if="!isStreaming && !lastFrame" class="placeholder">
            摄像头未开启
          </div>
        </div>

        <div class="info-container">
          <el-card class="info-card">
            <template #header>
              <div class="info-header">识别信息</div>
            </template>
            <div class="info-content">
              <div class="info-item">
                <span class="label">状态：</span>
                <span class="value">{{ recognitionInfo.success ? '已识别' : '未识别' }}</span>
              </div>
              <div class="info-item">
                <span class="label">姓名：</span>
                <span class="value">{{ recognitionInfo.data?.name || '未知' }}</span>
              </div>
              <div class="info-item">
                <span class="label">专业：</span>
                <span class="value">{{ recognitionInfo.data?.college || '未知' }}</span>
              </div>
              <div class="info-item">
                <span class="label">时间：</span>
                <span class="value">{{ formatTime(recognitionInfo.data?.timestamp) }}</span>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { sendImageForRecognition } from '@/api';

const videoStreamUrl = `http://localhost:3000/proxy/video-stream`;
const videoStream = ref<HTMLImageElement | null>(null);
const canvasOutput = ref<HTMLCanvasElement | null>(null);
const isStreaming = ref(false);
const lastFrame = ref<string | null>(null);

const recognitionInfo = ref({
  success: false,
  data: null,
  message: ''
});

const formatTime = (timestamp: number) => timestamp ? new Date(timestamp).toLocaleString() : '未知';

const startCamera = () => {
  isStreaming.value = true;
  lastFrame.value = null;
};
const stopCamera = () => isStreaming.value = false;

const startRecognition = async () => {
  try {
    if (!isStreaming.value || !videoStream.value || !canvasOutput.value) {
      ElMessage.error('请先开启摄像头');
      return;
    }

    const canvas = canvasOutput.value;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 640;
    canvas.height = 480;
    ctx.drawImage(videoStream.value, 0, 0, 640, 480);

    lastFrame.value = canvas.toDataURL('image/jpeg', 0.6);

    const imageBase64 = lastFrame.value.split(',')[1];
    const result = await sendImageForRecognition(imageBase64);
    
    recognitionInfo.value = result;
    
    if (result.success) {
      ElMessage.success(result.message || '识别成功');
      stopCamera();
    } else {
      ElMessage.warning(result.message || '识别失败');
    }
  } catch (err) {
    console.error('识别过程出错:', err);
    ElMessage.error('识别失败，请重试');
  }
};
</script>

<style scoped>
.container { padding: 20px; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group { display: flex; gap: 10px; }

.content-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.camera-container {
  flex: 0 0 auto;
  width: 640px;
  height: 480px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.video-stream {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  color: #909399;
  font-size: 16px;
}

.info-container {
  flex: 1;
  min-width: 300px;
}

.info-card { height: 480px; }

.info-header {
  font-weight: bold;
  color: #303133;
}

.info-content { padding: 10px; }

.info-item {
  margin-bottom: 15px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.info-item .label {
  font-weight: bold;
  color: #606266;
  margin-right: 10px;
}

.info-item .value { color: #303133; }
</style>