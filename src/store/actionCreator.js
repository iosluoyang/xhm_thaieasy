import store from './index'
import { UPDATE_USER, UPDATE_CONFIGARR, UPDATE_CONFIGVERSION } from './actionType'
import { loginapi } from '../api/userapi'
import { resolve } from 'url';

// 更新用户信息的action创建函数
export const updateuser = (userdata) => ({
    type: UPDATE_USER,
    data: userdata
})

// 更新配置文件数组的action创建函数
export function updateconfigarr(configdataarr) {
    return {
        type: UPDATE_CONFIGARR,
        data: configdataarr
    }
}

// 更新配置文件版本号的action创建函数
export function updateconfigversion(configdataversion) {
    return {
        type: UPDATE_CONFIGVERSION,
        data: configdataversion
    }
}

// 登录(使用中间件组件进行封装action  此时action可以返回函数而不仅仅是对象)
export const actionlogin = (logindata) => {
    return () => {
        return new Promise((resolve, reject) => {
            loginapi(logindata).then(response => {
                // 更新用户信息
                updateuser(response.data)
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    }
}

