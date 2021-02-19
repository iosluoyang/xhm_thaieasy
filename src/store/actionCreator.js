import store from './index'
import { UPDATE_ACCESSTOKEN, UPDATE_REFRESHTOKEN, UPDATE_USER, UPDATE_CONFIGARR, UPDATE_CONFIGVERSION } from './actionType'
import { loginapi, logoutapi } from '../api/userapi'

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

// 更新用户信息的action创建函数
export const updateUser = (user) => ({
    type: UPDATE_USER,
    data: user
})



// 业务内容

// 登录(使用中间件组件进行封装action  此时action可以返回函数而不仅仅是对象)
export const actionLogin = (logindata) => {
    return (dispatch) => {
        return new Promise((resolve, reject) => {
            loginapi(logindata).then(response => {
                
                let accessToken = response.data.accessToken
                let refreshToken = response.data.refreshToken
                let user = response.data.user
                if(accessToken && user) {
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

