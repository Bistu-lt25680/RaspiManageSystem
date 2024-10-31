<template>
  <div>
    <el-button @click="fetchMessageFromDjango">Fetch Message</el-button>
    <h2>Temperature: {{ DHT11Data.temperature }}°C</h2>
    <h2>Humidity: {{ DHT11Data.humidity }}%</h2>

    <el-card class="mgb20" shadow="hover">
      <template #header>
        <div class="header-container">
          <div class="content-title">温度实时监控</div>
        </div>
      </template>
      <v-chart class="chart" :option="temperatureOptions" autoresize />
    </el-card>

    <el-card class="mgb20" shadow="hover">
      <template #header>
        <div class="header-container">
          <div class="content-title">湿度实时监控</div>
        </div>
      </template>
      <v-chart class="chart" :option="humidityOptions" autoresize />
    </el-card>
  </div>
</template>

<script lang="ts" setup>
  import { fetchMessageFromDjango, DHT11Data, responsetocheck } from "@/api";
  import { onUnmounted, ref } from "vue";
  import { temperatureOptions, humidityOptions } from "./options";
  import VChart from "vue-echarts";
  import { use } from "echarts/core";
  import { CanvasRenderer } from "echarts/renderers";
  import { LineChart } from "echarts/charts";
  import { Queue, secondqueue } from "./queue";
  import {
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
  } from "echarts/components";

  // 注册必需的组件
  use([
    CanvasRenderer,
    LineChart,
    TitleComponent,
    TooltipComponent,
    GridComponent,
    DatasetComponent,
    TransformComponent,
    LegendComponent,
  ]);

  // 新增温湿度数据队列
  const temperatureQueue = new Queue(30);
  const humidityQueue = new Queue(30);

  function updateLineOptions() {
    // 检查数据是否有效
    if (!DHT11Data.value?.time?.hour) {
        return; // 如果数据无效，直接返回不更新
    }

    let timenow =
        DHT11Data.value.time.hour +
        ":" +
        DHT11Data.value.time.minute +
        ":" +
        DHT11Data.value.time.second;
    
    // 检查时间格式是否正确
    if (timenow === "::") {
        return; // 如果时间格式不正确，直接返回不更新
    }

    // 更新队列数据
    secondqueue.enqueue(timenow);
    temperatureQueue.enqueue(DHT11Data.value.temperature);
    humidityQueue.enqueue(DHT11Data.value.humidity);

    // 只有当队列中有数据时才更新图表
    if (!secondqueue.isEmpty()) {
        const timeData = secondqueue.toArray();
        
        // 更新温度图表
        temperatureOptions.xAxis.data = timeData;
        temperatureOptions.series[0].data = temperatureQueue.toArray();
        
        // 更新湿度图表
        humidityOptions.xAxis.data = timeData;
        humidityOptions.series[0].data = humidityQueue.toArray();
    }
  }

  // 初始化时先获取一次数据
  fetchMessageFromDjango().then(() => {
    updateLineOptions();
  });

  // 然后再开始定时更新
  let interval = setInterval(() => {
    fetchMessageFromDjango();
    updateLineOptions();
  }, 2000);

  onUnmounted(() => {
    if (interval) {
      clearInterval(interval);
    }
  });

</script>

<style scoped>
  .header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .content-title {
    font-size: 16px;
    font-weight: bold;
  }

  .chart {
    width: 100%;
    height: 300px; /* 稍微减小每个图表的高度 */
  }
</style>
