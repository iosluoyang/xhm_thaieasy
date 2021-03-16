import axiosinstance from './index'

// 获取应用的配置文件信息
export function getconfigdataapi(data) {
    return axiosinstance.request({ url: '/app/config/list.do', data })
}

// 获取OSS存储的相关配置信息
export function getossconfigapi(data) {
    return axiosinstance.request({ url: '/aliyunsts/app/token/h5token.do', data })
}