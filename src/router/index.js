import Home from '../pages/home'
import Content from '../pages/content'
import Me from '../pages/me'

let routers = [
    {
        path: '/',// 首页默认加载的页面
        component: Home,// 所使用的组件
        exact: false //是否为严格模式
    },
    {
        path: '/content',
        component: Content,
        exact: true
    },
    {
        path: '/me',
        component: Me,
        exact: true
    },
]

export default routers
