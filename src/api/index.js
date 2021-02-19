import axios from 'axios'
import QS from 'qs'; // 引入qs模块，用来序列化post类型的数据
import md5 from 'js-md5'
import mobiledevice from 'mobile-device-detect'
import store from '../store'
var dayjs = require('dayjs')

let app_key = 'GDYUY38878y897ihhgjY'
let app_id = '100300001'

// 创建请求实例
const instance = axios.create({
    baseURL: '/thaieasy/pro/apiapp',
    method: 'POST',
    timeout: 60000,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

// 增加公共报文头
function makerequestparam(config) {

    const state = store.getState()
    let appConfig = state.appConfig
    let appUser = state.appUser

    // 设置header的参数
    config.headers['accessToken'] = appUser.accessToken || ''
    config.headers['refreshToken'] = appUser.refreshToken || ''

    // 设置公共报文auth的参数
    let auth = {
        uid: appUser.user && appUser.user && appUser.user.uid ? appUser.user.uid : '',
        imei: 'H5-imei-123456',
        os: mobiledevice.osName, // 操作系统
        os_version: mobiledevice.osVersion, // 系统版本号
        devicetype: mobiledevice.deviceType, // 设备类型
        app_version: '1.0.0', // APP版本号
        client_flag: '02', // 请求客户端标识（“01”微信公众号，“02”wap商城(H5)
        config_version: appConfig.configVersion, // 配置文件的版本号
    }

    // 设置签名字符串 使用MD5的方式进行签名，待签名字符串为， timestamp=xxx&app_key 其中app_key为后台提供
    let timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss')
    let originalsign = 'timestamp=' + timestamp + '&' + app_key
    let sign = md5(originalsign).toUpperCase()

    // 更改参数体
    let data = {
        timestamp: timestamp,
        info: JSON.stringify(config.data || {}),
        auth: JSON.stringify(auth),
        sign: sign,
        app_id: app_id
    }

    config.data = QS.stringify(data)

    return config
}

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前增加公共报文头
    config = makerequestparam(config)
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 接口返回成功
    if (response.status === 200) {
        // 处理公共错误码
        let responseData = response.data
        let errorCode = responseData.errorCode
        // 首先进行验签操作 当sign数据为非 no sign 字样的时候进行验签
        if (responseData.sign !== 'no sign') {
            let timestamp = responseData.timestamp

            // 前端进行签名字符串 使用MD5的方式进行签名，待签名字符串为， timestamp=xxx&app_key
            let originalsign = 'timestamp=' + timestamp + '&' + app_key
            let mycountsign = md5(originalsign).toUpperCase()

            // 判断本地计算出来的签名和后台返回的签名是否一致 一致再进行下一步操作 否则报错直接返回
            if (mycountsign !== responseData.sign) {
                return Promise.reject({ msg: '接口验签失败' })
            }
        }

        // 统一的错误码处理 报接口错误信息  特殊错误码做特殊处理
        // 1.E30001 token失效，调用refreshToken接口获取新token
        // 2.E30004 refreshToken过期需要跳转到登录页面用户重新登录
        if (errorCode === '000000') {
            // 接口调用成功
            return responseData
        }
        // 系统配置信息需要更新
        else if (errorCode === 'E10023') {

        }
        // token失效，调用refreshToken接口获取新token
        else if (errorCode === 'E30001') {

        }
        // refreshToken过期或者用户信息不存在需要跳转到登录页面用户重新登录
        else if (errorCode === 'E30004') {
            // refreshToken过期或者用户信息不存在需要跳转到登录页面用户重新登录
            // 首先需要删除本地的所有用户信息
            // return store.dispatch('user/clearuserdata').then(() => {
            //     return Promise.reject(res || { msg: '登录态失效' })
            // })
        }
        // 该用户已在其他地方登录  弹出提示框然后今天页面跳转
        else if (errorCode === 'E30005') {

        }
        else {
            // 其他常见错误
            return Promise.reject(responseData)
        }
    }
    // 接口返回失败
    else {
        return Promise.reject(response.statusText);
    }
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default instance

