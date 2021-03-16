import store from './index'
import { UPDATE_ACCESSTOKEN, UPDATE_REFRESHTOKEN, UPDATE_USER, UPDATE_CONFIGARR, UPDATE_CONFIGVERSION, UPDATE_APPDRAWEROPEN, UPDATE_OSSCONFIG } from './actionType'
import { loginapi, logoutapi } from '../api/userapi';
import { getconfigdataapi, getossconfigapi } from '../api/baseapi';

// 更新配置文件版本号的action创建函数
export function updateConfigVersion(configVersion) {
    return {
        type: UPDATE_CONFIGVERSION,
        data: configVersion
    }
}

// 更新配置文件数组的action创建函数
export function updateConfigArr(configArr) {
    return {
        type: UPDATE_CONFIGARR,
        data: configArr
    }
}

// 更新APP全局抽屉的打开状态
export function updateAppDrawerOpen(openStatus) {
    return {
        type: UPDATE_APPDRAWEROPEN,
        data: openStatus
    }
}

// 更新accessToken的action创建函数
export const updateAccessToken = (accessToken) => {
    return {
        type: UPDATE_ACCESSTOKEN,
        data: accessToken
    }
}

// 更新refreshToken的action创建函数
export const updateRefreshToken = (refreshToken) => {
    return {
        type: UPDATE_REFRESHTOKEN,
        data: refreshToken
    }
}

// 更新用户信息的action创建函数(箭头函数语法)
export const updateUser = (user) => ({
    type: UPDATE_USER,
    data: user
})

// 更新OSS配置信息的action创建函数
export const updateOssConfig = (ossConfig) => ({
    type: UPDATE_OSSCONFIG,
    data: ossConfig
})



// 业务内容

// 获取系统配置信息
export const actionGetConfigData = () => {
    async function getconfigdata(dispatch) {
        getconfigdataapi().then(response => {
            // 获取到配置文件成功 进行数据更新
            let configVersion = response.data.configVersion
            let configArr = response.data.configList
            dispatch(updateConfigVersion(configVersion))
            dispatch(updateConfigArr(configArr))
        }).catch(error => {
            console.log(`获取配置信息失败`)
        })
    }
    return getconfigdata
}

// 登录(使用中间件组件进行封装action  此时action可以返回函数而不仅仅是对象)
export const actionLogin = (logindata) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            loginapi(logindata).then(response => {

                let accessToken = response.data.accessToken
                let refreshToken = response.data.refreshToken
                let user = response.data.user
                if (accessToken && user) {
                    // 更新用户信息
                    dispatch(updateAccessToken(accessToken))
                    dispatch(updateRefreshToken(refreshToken))
                    dispatch(updateUser(user))
                    resolve(response)
                }
                else {
                    reject(new Error('用户信息为空'))
                }

            }).catch(error => {
                reject(error)
            })
        })
    }
}

// 登出
export const actionLogout = () => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            logoutapi().then(() => {
                // 更新用户信息
                dispatch(updateAccessToken(''))
                dispatch(updateRefreshToken(''))
                dispatch(updateUser(null))
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    }
}

// 获取OSS文件存储配置信息
export const actionGetOssConfig = () => {

    return (dispatch) => {
        return new Promise((resolve, reject) => {
            // 环境信息
            //  xhmtest测试环境
            //  xhmyfb预发布环境
            //  xhmpro生产环境
            let envinfo = 'xhmtest'
            console.log(`开始调用接口API`)
            getossconfigapi({ envinfo: envinfo }).then(response => {
                // 获取成功
                dispatch(updateOssConfig(response.data))
                resolve(response.data)
            }).catch(error => {
                // 获取OSS配置信息失败
                reject(error)
            })
        })
    }
}

