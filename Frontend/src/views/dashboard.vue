<template>
    <div>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">实时温度</p>
                    </div>
                    <div class="chart-container">
                        <v-chart class="chart" :option="tempSpec" :manual-update="true" ref="tempChart" />
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">实时湿度</p>
                    </div>
                    <div class="chart-container">
                        <v-chart class="chart" :option="humidSpec" :manual-update="true" ref="humidChart" />
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card shadow="hover" :body-style="{ height: '400px' }">
                    <div class="card-header">
                        <p class="card-header-title">超声测距</p>
                    </div>
                    <div class="chart-container">
                        <v-chart class="chart" :option="distanceSpec" :manual-update="true" ref="distanceChart" />
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts" name="dashboard">
import { use } from 'echarts/core';
import { GaugeChart } from 'echarts/charts';
import {
    TooltipComponent,
    LegendComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';
import { ref, onMounted, onUnmounted } from 'vue';
import { DHT11Data, DistanceData, fetchMessageFromDjango, fetchDistanceFromDjango } from '@/api';

// 注册必要的组件
use([
    CanvasRenderer,
    GaugeChart,
    TooltipComponent,
    LegendComponent,
]);

const tempChart = ref(null);
const humidChart = ref(null);
const distanceChart = ref(null);

// 温度仪表盘配置
const tempSpec = ref({
    series: [{
        type: 'gauge',
        min: 0,
        max: 50,
        radius: '85%',
        center: ['50%', '60%'],
        progress: {
            show: true,
            width: 15
        },
        axisLine: {
            z: 0,
            lineStyle: {
                width: 15,
                color: [
                    [0.3, '#67e0e3'],
                    [0.7, '#37a2da'],
                    [1, '#fd666d']
                ]
            }
        },
        pointer: {
            show: true,
            itemStyle: {
                color: 'auto'
            },
            length: '60%',
            width: 6,
            z: 5
        },
        axisTick: {
            z: 1,
            distance: -15,
            length: 6,
            lineStyle: {
                color: '#fff',
                width: 2
            }
        },
        splitLine: {
            z: 1,
            distance: -15,
            length: 15,
            lineStyle: {
                color: '#fff',
                width: 3
            }
        },
        axisLabel: {
            z: 2,
            color: 'inherit',
            distance: 25,
            fontSize: 12
        },
        detail: {
            z: 3,
            valueAnimation: true,
            formatter: '{value} °C',
            color: 'inherit',
            fontSize: 24,
            offsetCenter: [0, '20%']
        },
        title: {
            z: 3,
            fontSize: 14,
            offsetCenter: [0, '-20%']
        },
        data: [{
            value: 0,
            name: '温度'
        }]
    }]
});

// 湿度仪表盘配置
const humidSpec = ref({
    series: [{
        type: 'gauge',
        min: 0,
        max: 100,
        radius: '85%',
        center: ['50%', '60%'],
        progress: {
            show: true,
            width: 15
        },
        axisLine: {
            lineStyle: {
                width: 15,
                color: [
                    [0.2, '#fd666d'],
                    [0.8, '#37a2da'],
                    [1, '#67e0e3']
                ]
            }
        },
        pointer: {
            show: true,
            itemStyle: {
                color: 'auto'
            },
            length: '60%',
            width: 6,
            z: 5
        },
        axisTick: {
            distance: -15,
            length: 6,
            lineStyle: {
                color: '#fff',
                width: 2
            }
        },
        splitLine: {
            distance: -15,
            length: 15,
            lineStyle: {
                color: '#fff',
                width: 3
            }
        },
        axisLabel: {
            color: 'inherit',
            distance: 25,
            fontSize: 12
        },
        detail: {
            valueAnimation: true,
            formatter: '{value} %',
            color: 'inherit',
            fontSize: 24,
            offsetCenter: [0, '20%']
        },
        title: {
            fontSize: 14,
            offsetCenter: [0, '-20%'],
            z: 10
        },
        data: [{
            value: 0,
            name: '湿度'
        }]
    }]
});

// 距离仪表盘配置
const distanceSpec = ref({
    series: [{
        type: 'gauge',
        min: 0,
        max: 4.5,
        radius: '85%',
        center: ['50%', '60%'],
        progress: {
            show: true,
            width: 15
        },
        axisLine: {
            lineStyle: {
                width: 15,
                color: [
                    [0.2, '#67e0e3'],
                    [0.8, '#37a2da'],
                    [1, '#fd666d']
                ]
            }
        },
        pointer: {
            show: true,
            itemStyle: {
                color: 'auto'
            },
            length: '60%',
            width: 6,
            z: 5
        },
        axisTick: {
            distance: -15,
            length: 6,
            lineStyle: {
                color: '#fff',
                width: 2
            }
        },
        splitLine: {
            distance: -15,
            length: 15,
            lineStyle: {
                color: '#fff',
                width: 3
            }
        },
        axisLabel: {
            color: 'inherit',
            distance: 25,
            fontSize: 12,
            formatter: function(value: number) {
                return value.toFixed(1) + 'm';
            }
        },
        detail: {
            valueAnimation: true,
            formatter: function(value: number) {
                return value.toFixed(2) + ' m';
            },
            color: 'inherit',
            fontSize: 24,
            offsetCenter: [0, '20%']
        },
        title: {
            fontSize: 14,
            offsetCenter: [0, '-20%'],
            z: 10
        },
        data: [{
            value: 0,
            name: '距离'
        }]
    }]
});

let updateTimer: number | null = null;

// 更新数据的函数
const updateCharts = () => {
    if (tempChart.value && humidChart.value && distanceChart.value) {
        tempSpec.value.series[0].data[0].value = DHT11Data.value.temperature;
        humidSpec.value.series[0].data[0].value = DHT11Data.value.humidity;
        distanceSpec.value.series[0].data[0].value = DistanceData.value.distance;
        
        // 手动触发图表更新
        tempChart.value.setOption(tempSpec.value);
        humidChart.value.setOption(humidSpec.value);
        distanceChart.value.setOption(distanceSpec.value);
    }
};

// 定时获取数据
const startFetching = () => {
    // 立即获取一次数据
    Promise.all([
        fetchMessageFromDjango(),
        fetchDistanceFromDjango()
    ]).then(() => {
        updateCharts();
    });

    // 统一使用一个定时器，每秒更新所有数据
    updateTimer = window.setInterval(() => {
        Promise.all([
            fetchMessageFromDjango(),
            fetchDistanceFromDjango()
        ]).then(() => {
            updateCharts();
        });
    }, 1000);  // 1秒更新一次
};

onMounted(() => {
    startFetching();
});

onUnmounted(() => {
    if (updateTimer) {
        clearInterval(updateTimer);
        updateTimer = null;
    }
});
</script>

<style scoped>
.chart-container {
    width: 100%;
    height: 350px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chart {
    width: 100% !important;
    height: 100% !important;
}

.card-header {
    padding-left: 10px;
    margin-bottom: 10px;
}

.card-header-title {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 5px;
}
</style>
