import axiosinstance from './index'

export function gethomepagedata(data) {
    return axiosinstance.request({ url: '/app/home/gethomeinfo.do', data })
}