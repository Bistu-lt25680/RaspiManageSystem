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
        <!-- 左侧视频区域 -->
        <div class="camera-container">
          <video ref="videoRef" id="videoInput" style="display: none;" width="640" height="480"></video>
          <canvas ref="canvasOutput" id="canvasOutput"></canvas>
        </div>

        <!-- 右侧信息区域 -->
        <div class="info-container">
          <el-card class="info-card">
            <template #header>
              <div class="info-header">
                识别信息
              </div>
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
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { cv } from '@/utils/opencv-utils';
import { sendImageForRecognition } from '@/api';

const videoRef = ref<HTMLVideoElement | null>(null);
const isStreaming = ref(false);
let stream: MediaStream | null = null;
let video: HTMLVideoElement;
let cap: any;

const recognitionInfo = ref({
  success: false,
  data: null,
  message: ''
});

const formatTime = (timestamp: number) => {
  if (!timestamp) return '未知';
  return new Date(timestamp).toLocaleString();
};

// 清空画布为灰色
const clearCanvas = () => {
  const canvas = document.getElementById('canvasOutput') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f5f7fa';  // 使用和背景色相同的灰色
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
};

const startCamera = async () => {
  try {
    if (!cv) {
      ElMessage.error('OpenCV.js 未加载完成');
      return;
    }

    stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: 640,
        height: 480
      },
      audio: false
    });

    video = document.getElementById('videoInput') as HTMLVideoElement;
    video.srcObject = stream;
    
    // 等待视频准备就绪
    video.onloadedmetadata = () => {
      video.play();
      cap = new cv.VideoCapture(video);
      isStreaming.value = true;
      processVideo();
    };

  } catch (error) {
    ElMessage.error('无法访问摄像头，请确保已授予摄像头权限');
    console.error('摄像头错误:', error);
  }
};

const processVideo = () => {
  try {
    if (!isStreaming.value) return;
    
    const frame = new cv.Mat(480, 640, cv.CV_8UC4);
    cap.read(frame);
    cv.imshow('canvasOutput', frame);
    frame.delete();
    
    requestAnimationFrame(processVideo);
  } catch (err) {
    console.error('处理视频帧时出错:', err);
  }
};

const stopCamera = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    isStreaming.value = false;
    clearCanvas();  // 关闭摄像头时清空画布
  }
};

const startRecognition = async () => {
  try {
    if (!isStreaming.value) {
      isStreaming.value = true;
      processVideo();
      return;
    }
    
    const frame = new cv.Mat(480, 640, cv.CV_8UC4);
    cap.read(frame);
    cv.imshow('canvasOutput', frame);
    frame.delete();
    
    const canvas = document.getElementById('canvasOutput') as HTMLCanvasElement;
    const imageBase64 = canvas.toDataURL('image/jpeg', 0.6).split(',')[1];

    isStreaming.value = false;
    
    const result = await sendImageForRecognition(imageBase64);
    console.log('识别响应:', result);
    
    recognitionInfo.value = result;
    
    if (result.success) {
      ElMessage.success(result.message || '识别成功');
    } else {
      ElMessage.warning(result.message || '识别失败');
    }
    
  } catch (err) {
    console.error('识别过程出错:', err);
    ElMessage.error('识别失败，请重试');
  }
};

onMounted(() => {
  // 等待 OpenCV.js 加载完成
  if (!cv) {
    const checkInterval = setInterval(() => {
      if (cv) {
        clearInterval(checkInterval);
        console.log('OpenCV.js 加载完成');
      }
    }, 100);
  }
  clearCanvas();  // 初始化时清空画布
});

onUnmounted(() => {
  stopCamera();
});
</script>

<style scoped>
.container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.button-group {
  display: flex;
  gap: 10px; /* 按钮之间的间距 */
}

.content-container {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.camera-container {
  flex: 0 0 auto;
}

.info-container {
  flex: 1;
  min-width: 300px;
}

.info-card {
  height: 480px;
}

.info-header {
  font-weight: bold;
  color: #303133;
}

.info-content {
  padding: 10px;
}

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

.info-item .value {
  color: #303133;
}

#canvasOutput {
  width: 640px;
  height: 480px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #f5f7fa;
}
</style>