import React from 'react'
import { Switch, Route } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles'
import { Box, Hidden } from '@material-ui/core'
import NavBar from './navbar'
import TabBar from './tabbar'
import AppDrawer from './drawer'

export default function Layout(props) {

    const useStyles = makeStyles((theme) => {
        return {
            layout: {

            }
        }
    })
    const classes = useStyles()

    const { routes } = props

    return (

        <Box className={classes.layout}>

            {/* 头部导航 */}
            <NavBar isHome></ NavBar>

            {/* 中间内容区域 */}
            <Switch>
                {
                    routes.map((route, index) => {
                        return (
                            <Route exact={route.exact} key={index} path={route.path} component={route.component} />
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