import axiosinstance from './index'

export function addproductapi(data) {
    return axiosinstance.request({ url: '/app/product/add.do', data })
}