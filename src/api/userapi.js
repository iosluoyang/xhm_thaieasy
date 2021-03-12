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
// 发送重置密码邮件
export function sendsetpwdemailapi(data) {
    return axiosinstance.request({ url: '/app/user/forgotPwd.do', data })
}
// 用户重置密码
export function setpwdapi(data) {
    return axiosinstance.request({ url: '/app/user/setPwd.do', data })
}
// 用户登录
export function loginapi(data) {
    return axiosinstance.request({ url: '/app/user/login.do', data })
}
// 用户登出
export function logoutapi(data) {
    return axiosinstance.request({ url: '/app/user/logout.do', data })
}