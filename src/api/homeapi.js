import axiosinstance from './index'

export function gethomepagedataapi(data) {
    return axiosinstance.request({ url: '/app/home/gethomeinfo.do', data })
}