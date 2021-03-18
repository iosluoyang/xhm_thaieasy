// 用户相关的reducer
import { combineReducers } from 'redux'
import { UPDATE_ACCESSTOKEN, UPDATE_REFRESHTOKEN, UPDATE_USER, UPDATE_CONFIGARR, UPDATE_CONFIGVERSION, UPDATE_APPDRAWEROPEN, UPDATE_OSSCONFIG } from './actionType'

/*

    保持 reducer 纯净非常重要。永远不要在 reducer 里做这些操作：

    1.修改传入参数；
    2.执行有副作用的操作，如 API 请求和路由跳转；
    3.调用非纯函数，如 Date.now() 或 Math.random()。

*/

// 定义默认的state值
let initialState = {

    appConfig: {
        configVersion: null,
        configDataArr: null,
        appName: 'ThaiEasy泰易贝',
        imgUrl: '',
        appDrawerOpen: false, // 全局左侧抽屉的开关
    },
    appUser: {
        accessToken: '',
        refreshToken: '',
        user: null
    },
    ossConfig: null


}

// 配置信息相关reducer
function ConfigReducer(appConfigState = initialState.appConfig, action) {

    switch (action.type) {

        // 更新配置文件版本号
        case UPDATE_CONFIGVERSION:
            return { ...appConfigState, ...{ configVersion: action.data } }
            break;

        // 更新配置文件数据
        case UPDATE_CONFIGARR:

            // 获取图片前缀 imgUrl
            let imgUrl = action.data.find(eachitem => { return eachitem.itemKey === 'imgUrlPrefix' }).itemVal || ''

            return { ...appConfigState, ...{ configDataArr: action.data }, ...{ imgUrl: imgUrl } }
            break;

        // 更新全局抽屉的打开状态
        case UPDATE_APPDRAWEROPEN:
            return { ...appConfigState, ...{ appDrawerOpen: action.data } }
            break;

        // 其他情况返回默认的state
        default:
            return appConfigState
            break;
    }

}

// 用户相关reducer
function UserReducer(appUserState = initialState.appUser, action) {

    switch (action.type) {

        // 更新accessToken
        case UPDATE_ACCESSTOKEN:
            return { ...appUserState, ...{ accessToken: action.data } }
            break;

        // 更新refreshToken
        case UPDATE_REFRESHTOKEN:
            return { ...appUserState, ...{ refreshToken: action.data } }
            break;

        // 更新用户信息
        case UPDATE_USER:
            return { ...appUserState, ...{ user: action.data } }
            break;

        // 其他情况返回默认的state
        default:
            return appUserState
            break;
    }

}

// OSS相关reducer
function OSSReducer(ossConfigState = initialState.ossConfig, action) {
    switch (action.type) {

        // 更新oss配置信息
        case UPDATE_OSSCONFIG:
            return action.data
            break;

        default:
            return ossConfigState
            break;
    }
}

// 整体的reducer
const AppReducer = combineReducers({

    appConfig: ConfigReducer,
    appUser: UserReducer,
    ossConfig: OSSReducer

})

export default AppReducer