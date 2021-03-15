import React from 'react'
import { Switch } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles'
import { Box, Hidden } from '@material-ui/core'
import NavBar from './navbar'
import TabBar from './tabbar'
import AppDrawer from './drawer'
import AuthRoute from '@/components/AuthRoute'

export default function Layout(props) {

    const useStyles = makeStyles((theme) => {
        return {
            root: {
                height: '100%'
            }
        }
    })
    const classes = useStyles()

    const { routes } = props

    return (

        <Box className={classes.root}>

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
                <TabBar></ TabBar>
            </Hidden>

            {/* 侧边栏弹出框 */}
            <AppDrawer direction="left"></AppDrawer>

        </Box>

    )
}