import { ref, reactive } from 'vue';
import { secondqueue } from "./queue";

// 温度图表配置
export const temperatureOptions = reactive({
    tooltip: {
        trigger: 'axis',
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
    },
    yAxis: {
        type: 'value',
        name: '温度(°C)'
    },
    series: [
        {
            name: 'temperature',
            type: 'line',
            smooth: true,
            color: '#009688',
            data: [],
        }
    ],
});

// 湿度图表配置
export const humidityOptions = reactive({
    tooltip: {
        trigger: 'axis',
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: [],
    },
    yAxis: {
        type: 'value',
        name: '湿度(%)'
    },
    series: [
        {
            name: 'humidity',
            type: 'line',
            smooth: true,
            color: '#f44336',
            data: [],
        }
    ],
});