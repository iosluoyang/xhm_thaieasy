import React from 'react'
import { Switch, useRouteMatch } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles'
import { Box, Hidden } from '@material-ui/core'
import NavBar from './navbar'
import TabBar from './tabbar'
import AppDrawer from './drawer'
import AuthRoute from '@/components/AuthRoute'

export default function Layout(props) {

    const useStyles = makeStyles((theme) => {
        return {
            layout: {

            }
        }
    })
    const classes = useStyles()

    const { routes } = props
    const match = useRouteMatch()


    return (

        <Box className={classes.layout}>

            {/* 头部导航 */}
            <NavBar isHome></ NavBar>

            {/* 中间内容区域 */}
            <Switch>
                {
                    routes && routes.length > 0 &&
                    routes.map((route) => {
                        return (
                            // <AuthRoute key={route.path} {...{ ...route, ...{ path: match.url + route.path } }} ></AuthRoute>
                            <AuthRoute key={route.path} {...route}></AuthRoute>
                        )
                    })
                }
            </Switch>

            {/* 底部导航 sm尺寸之上隐藏 */}
            <Hidden smUp>
                <TabBar currentTabValue='home'></ TabBar>
            </Hidden>

            {/* 侧边栏弹出框 */}
            <AppDrawer direction="left"></AppDrawer>

        </Box>

    )
}