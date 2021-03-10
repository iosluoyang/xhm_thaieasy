import axiosinstance from './index'

// 用户注册
export function registerapi(data) {
    return axiosinstance.request({ url: '/app/user/register.do', data })
}
// 用户激活账号
export function activeaccountapi(data) {
    return axiosinstance.request({ url: '/app/user/activate.do', data })
}
// 手动发送激活邮件
export function sendactiveapi(data) {
    return axiosinstance.request({ url: '/app/user/sendActivateCode.do', data })
}

export function loginapi(data) {
    return axiosinstance.request({ url: '/app/user/login.do', data })
}

export function logoutapi(data) {
    return axiosinstance.request({ url: '/app/user/logout.do', data })
}