export const UPDATE_USER = 'UPATE_USER'

export const UPDATE_CONFIGARR = 'UPDATE_CONFIGARR'

export const UPDATE_CONFIGVERSION = 'UPDATE_CONFIGVERSION'

// 更新用户信息的action创建函数
export function updateuser(userdata) {
    return {
        type: UPDATE_USER,
        data: userdata
    }
}

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

