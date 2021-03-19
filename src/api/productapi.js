import axiosinstance from './index'

// 获取商品列表接口
export function getproductlistapi(data) {
    return axiosinstance.request({ url: '/app/product/list.do', data })
}

// 增加商品接口
export function addproductapi(data) {
    return axiosinstance.request({ url: '/app/product/add.do', data })
}

// 获取商品详情信息接口
export function getproductdetailapi(data) {
    return axiosinstance.request({ url: '/app/product/detail.do', data })
}