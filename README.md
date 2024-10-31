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
2. MySQL

### 硬件
1. Raspberry 400
2. DHT11
3. 摄像头

## 项目实现
注意：视频监控使用现成库

Vue3 实现前端页面,左侧菜单栏,右侧页面区域 菜单栏分别有温湿度测量,视频监控(暂时无功能),人脸识别三个子菜单。在温湿度测量页面,显示温湿度数据,并用Echarts绘制温湿度曲线。

Raspberry 本地调用DHT11,摄像头,上传到后端。

Django 接收Raspberry上传的温湿度数据，储存到数据库，然后返回给前端。本地调用OpenCV和YOLO进行人脸识别，并将某帧(成功识别的那一帧)的图片和识别结果保存到数据库，然后返回给前端。

## 安装
```
cd Frontend
npm i
```

```
cd Backend
python manage.py runserver
```

```
python test.py //测试
```

## 前端结构
# vue-manage-system-master -> src/main.ts

- .github/
  - FUNDING.yml
- .gitignore
- auto-imports.d.ts
- components.d.ts
- index.html
- LICENSE
- package-lock.json
- package.json
- public/
  - mock/
    - role.json
    - table.json
    - user.json
  - template.xlsx
- README.md
- README_EN.md
- screenshots/
  - wms1.png
  - wms3.png
- src/
  - api/
    - index.ts
  - App.vue # 主页面,RouterView路由 -> ./router/index.ts
  - assets/
    - css/
      - icon.css
      - main.css
    - img/
      - img.jpg
      - login-bg.jpg
      - logo.svg
      - ucenter-bg.jpg
  - components/ # 组件
    - countup.vue
    - header.vue
    - menu.ts # 侧边栏加载的菜单 每个菜单都要在../store/permiss.ts中注册 -> ./store/permiss.ts
    - sidebar.vue # 侧边栏 -> ./menu.ts
    - table-custom.vue
    - table-detail.vue
    - table-edit.vue
    - table-search.vue
    - tabs.vue
  - main.ts # 入口文件 -> ./App.vue
  - router/
    - index.ts # 路由配置 默认是home/dashboard 有home的子页面 -> ../views/home.vue
  - store/
    - permiss.ts
    - sidebar.ts 
    - tabs.ts
    - theme.ts
  - types/
    - form-option.ts
    - menu.ts
    - role.ts
    - table.ts
    - user.ts
  - utils/
    - china.ts
    - index.ts
    - request.ts
  - views/
    - chart/
      - echarts.vue
      - options.ts
      - schart.vue
    - dashboard.vue
    - element/
      - calendar.vue
      - carousel.vue
      - form.vue
      - statistic.vue
      - steps.vue
      - tabs.vue
      - tour.vue
      - upload.vue
      - watermark.vue
    - home.vue # 主页面 加载了header和sidebar 剩下的content加载路由的其他页面 这些页面都是home的子页面 -> ./router/index.ts
    - pages/
      - 403.vue
      - 404.vue
      - editor.vue
      - icon.vue
      - login.vue
      - markdown.vue
      - register.vue
      - reset-pwd.vue
      - theme.vue
      - ucenter.vue
    - system/
      - menu.vue
      - role-permission.vue
      - role.vue
      - user.vue
    - table/
      - basetable.vue
      - export.vue
      - import.vue
      - table-editor.vue
  - vite-env.d.ts
- tsconfig.json
- tsconfig.node.json
- vite.config.ts
- yarn.lock