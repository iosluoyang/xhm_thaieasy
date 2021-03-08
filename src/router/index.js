import App from '../App'
import Layout from '../components/layout'
import Home from '../pages/home'
import Mission from '../pages/mission'
import Me from '../pages/me'

import Account from '../pages/account'
import Login from '../pages/account/login'
import Register from '../pages/account/register'
import ForgetPwd from '../pages/account/forgetpwd'


import WishProduct from '../pages/wishproduct'
import WishProductList from '../pages/wishproduct/productlist'
import HandleProduct from '../pages/wishproduct/handleproduct.js'
import ActiveAccnount from '../pages/account/activeAccount'

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
                path: 'activeaccount/:code',
                component: ActiveAccnount,
            },
            {
                path: '/forgetpwd',
                component: ForgetPwd,
            }
        ]
    },
    {
        path: '/wishproduct',
        component: WishProduct,
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
                path: '',
                component: Home,
                exact: true
            },
            {
                path: '/mission',
                component: Mission,
            },
            {
                path: '/me',
                component: Me,
            },
        ]
    },


]

export default routes
