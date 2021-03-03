import App from '../App'
import Layout from '../components/layout'
import Home from '../pages/home'
import Content from '../pages/content'
import Me from '../pages/me'
import Login from '../pages/login'
import Register from '../pages/register'
import WishProduct from '../pages/wishproduct'
import WishProductList from '../pages/wishproduct/productlist'
import HandleProduct from '../pages/wishproduct/handleproduct.js'

let routes = [

    {
        path: '/register',
        component: Register
    },
    {
        path: '/login',
        component: Login
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
                path: '/',
                component: Home,
                exact: true
            },
            {
                path: '/content',
                component: Content,
            },
            {
                path: '/me',
                component: Me,
            },
        ]
    },


]

export default routes
