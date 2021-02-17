import axiosinstance from './index'

export function loginapi(data) {
    return axiosinstance.request({ url: '/app/user/login.do', data })
}