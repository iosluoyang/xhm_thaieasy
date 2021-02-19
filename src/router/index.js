import App from '../App'
import Layout from '../components/layout'
import Home from '../pages/home'
import Content from '../pages/content'
import Me from '../pages/me'
import Login from '../pages/login'

let routes = [

    {
        path: '/',// 首页默认加载的页面
        component: Layout,// 所使用的组件
        indexRoute: {component: Layout},
        exact: true, //是否为严格模式
        childRoutes: [
            {
                path: 'home',
                component: Home,
            },
            {
                path: 'content',
                component: Content,
            },
            {
                path: 'me',
                component: Me,
            },
        ]
    }
    
]

export default routes
