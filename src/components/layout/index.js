import React from 'react'
import { Router, Route, Switch, Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles'
import { Box, Hidden } from '@material-ui/core'
import NavBar from './navbar/index'
import TabBar from './tabbar/index'
import Home from '../../pages/home'
import Content from '../../pages/content'
import Me from '../../pages/me'
import Login from '../../pages/login'

export default function Layout(props) {

    const useStyles = makeStyles((theme) => {
        return {
            layout: {
                padding: '80px 0',
            }
        }
    })
    const classes = useStyles()

    return (

        <Box className={classes.layout}>

            {/* 头部导航 */}
            <NavBar></ NavBar>

            {/* 中间内容区域 */}
            {

                <Switch>
                    <Route exact path="/" component={Home}></Route>
                    <Route path="/content" component={Content}></Route>
                    <Route path="/me" component={Me}></Route>
                    <Route path="/login" component={Login}></Route>
                </Switch>
                
            }

            {/* 底部导航 sm尺寸之上隐藏 */}
            <Hidden smUp>
                <TabBar currentTabValue='home'></ TabBar>
            </Hidden>

        </Box>

    )
}