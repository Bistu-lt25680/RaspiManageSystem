import axios from 'axios';
import request from '../utils/request';
import { ref } from 'vue';
import { url, testurl } from './url';
export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchUserData = () => {
    return request({
        url: './mock/user.json',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};

interface TimeData {
    year: string;
    month: string;
    day: string;
    hour: string;
    minute: string;
    second: string;
}

export const DHT11Data = ref({
    temperature: 0,
    humidity: 0,
    time: {
        year: '',
        month: '',
        day: '',
        hour: '',
        minute: '',
        second: ''
    } as TimeData
});

// 时间戳转换函数
function timestampToTime(timestamp: number): TimeData {
    // 如果时间戳是秒级的（10位数），需要转换为毫秒
    if (timestamp.toString().length === 10) {
        timestamp = timestamp * 1000;
    }
    const date = new Date(timestamp);
    return {
        year: date.getFullYear().toString(),
        month: String(date.getMonth() + 1).padStart(2, '0'),
        day: String(date.getDate()).padStart(2, '0'),
        hour: String(date.getHours()).padStart(2, '0'),
        minute: String(date.getMinutes()).padStart(2, '0'),
        second: String(date.getSeconds()).padStart(2, '0')
    };
}
let responsetocheck;
export const fetchMessageFromDjango = () => {
    return request({
        url: `${testurl}/api/dht11datas`,
        method: 'get'
    }).then(response => {
        responsetocheck = response.data;
        DHT11Data.value = {
            temperature: response.data.temperature,
            humidity: response.data.humidity,
            time: timestampToTime(response.data.timestamp)
        };
        // console.log(response.data);
    });
};

export const sendImageForRecognition = async (imageData: string) => {
    try {
        const response = await axios({
            method: 'post',
            url: `${testurl}/api/face-recognition`,
            data: {
                image: imageData
            },
            headers: {
                'Content-Type': 'application/json'
            },
            // 添加额外的 axios 配置
            timeout: 10000,  // 10秒超时
            withCredentials: true,  // 支持跨域 cookie
        });

        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios错误:', error.response?.data || error.message);
            return {
                success: false,
                message: error.response?.data?.message || '请求失败'
            };
        }
        return {
            success: false,
            message: '未知错误'
        };
    }
};

export { responsetocheck };


