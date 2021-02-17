// 用户相关的reducer
import { combineReducers } from 'redux'
import { UPDATE_USER, UPDATE_CONFIGARR, UPDATE_CONFIGVERSION } from './action'

let initialState = {
    config: {
        configdataarr: null,
        configversion: null,
    },
    user: null,
}

// 配置信息相关reducer
function ConfigReducer(configstate = {}, action) {

    switch (action.type) {

        // 更新配置文件版本号
        case UPDATE_CONFIGVERSION:
            return { ...configstate, ...{ configdataversion: action.data } }
            break;

        // 更新配置文件数据
        case UPDATE_CONFIGARR:
            return { ...configstate, ...{ configdataarr: action.data } }
            break;

        // 其他情况返回默认的state
        default:
            return configstate
            break;
    }

}

// 用户相关reducer
function UserReducer(userstate = null, action) {

    switch (action.type) {

        // 更新用户信息
        case UPDATE_USER:
            return action.data
            break;

        // 其他情况返回默认的state
        default:
            return userstate
            break;
    }

}

// 整体的reducer
const AppReducer = combineReducers({

    config: ConfigReducer,
    user: UserReducer

})

export default AppReducer