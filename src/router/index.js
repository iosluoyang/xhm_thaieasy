import { lazy } from 'react'
import Layout from '../components/layout'
import Home from '../pages/home'
import Mission from '../pages/mission'
import Me from '../pages/me'

import Account from '../pages/account'
import Login from '../pages/account/login'
import Register from '../pages/account/register'
import HandlePwd from '../pages/account/handlePwd'
import ActiveAccnount from '../pages/account/activeAccount'


// 代码分割  路由懒加载
// import WishProduct from '../pages/wishproduct'
// import WishProductList from '../pages/wishproduct/productlist'
// import HandleProduct from '../pages/wishproduct/handleproduct'

const WishProduct = lazy(() => import('../pages/wishproduct'))
const WishProductList = lazy(() => import('../pages/wishproduct/productlist'))
const HandleProduct = lazy(() => import('../pages/wishproduct/handleproduct'))


let routes = [

    {
        path: '/account',
        component: Account,
        routes: [
            {
                path: '',
                component: Login,
                exact: true
            },
            {
                path: '/login',
                component: Login,
            },
            {
                path: '/register',
                component: Register,
            },
            {
                path: '/activeaccount/:code?',
                component: ActiveAccnount,
            },
            {
                path: '/handlepwd/:type/:code?', // type reset为重置密码(需要传对应uid和旧密码)  forget为忘记密码(需要传code)
                component: HandlePwd,
            }
        ]
    },
    {
        path: '/wishproduct',
        component: WishProduct,
        auth: true, // 需要登录鉴权
        routes: [
            {
                path: '/productlist',
                component: WishProductList,
            },
            {
                path: '/handleproduct/:type',
                component: HandleProduct,
            }
        ]
    },
    {
        path: '/',// 首页默认加载的页面
        component: Layout,// 所使用的组件
        routes: [

            {
                path: '/mission',
                component: Mission,
                auth: true, // 需要登录鉴权
            },
            {
                path: '/me',
                component: Me,
            },
            {
                path: '',
                component: Home,
            },

        ]
    },

]

export default routes
