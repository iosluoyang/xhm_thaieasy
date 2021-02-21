import axiosinstance from './index'

export function registerapi(data) {
    return axiosinstance.request({ url: '/app/user/register.do', data })
}

export function loginapi(data) {
    return axiosinstance.request({ url: '/app/user/login.do', data })
}

export function logoutapi(data) {
    return axiosinstance.request({ url: '/app/user/logout.do', data })
}