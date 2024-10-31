# Raspberry 400 Project

## 项目目标
1. 基于DHT11的温湿度测量
2. 视频监控(现成库)
3. 人脸识别

## 项目框架

### 前端
1. Vue3
2. Vite
3. Element Plus
4. Pinia
5. Echarts

### 后端
1. Django
2. OpenCV
3. YOLO
4. MongoDB

### 硬件
1. Raspberry 400
2. DHT11
3. 摄像头

## 项目实现
注意：视频监控使用现成库

Vue3 实现前端页面,手写一个SPA,左侧菜单栏,右侧页面区域 菜单栏分别有温湿度测量,视频监控(暂时无功能),人脸识别三个子菜单。在温湿度测量页面,显示温湿度数据,并用Echarts绘制温湿度曲线。

Raspberry 本地调用DHT11,摄像头,上传到后端。

Django 接收Raspberry上传的温湿度数据，储存到数据库，然后返回给前端。本地调用OpenCV和YOLO进行人脸识别，并将某帧(成功识别的那一帧)的图片和识别结果保存到数据库，然后返回给前端。

## 安装


