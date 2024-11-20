import { Menus } from '@/types/menu';

export const menuData: Menus[] = [
    {
        id: '0',
        title: '系统首页',
        index: '/dashboard',
        icon: 'Odometer',
    },
    {
        id: '1',
        title: '系统管理',
        index: '1',
        icon: 'HomeFilled',
        children: [
            {
                id: '11',
                pid: '1',
                index: '/system-user',
                title: '用户管理',
            },
            {
                id: '12',
                pid: '1',
                index: '/system-role',
                title: '角色管理',
            },
            {
                id: '13',
                pid: '1',
                index: '/system-menu',
                title: '菜单管理',
            },
            {
                id: '114514',
                pid: '1',
                index: '/system-menu',
                title: '菜单管理666',
            },
        ],
    },
    {
        id: '8',
        title: '组件',
        index: '8',
        icon: 'Menu',
        children: [
            {
                id: '81',
                pid: '8',
                index: '/DHT11',
                title: '温湿度监控',
            },
            {
                id: '82',
                pid: '8',
                index: '/VideoSurveillance',
                title: '视频监控',
            },
            {
                id: '83',
                pid: '8',
                index: '/FaceRecognition',
                title: '人脸识别',
            },
        ],
    },
    {
        id: '7',
        icon: 'Brush',
        index: '/theme',
        title: '主题',
    },
];
