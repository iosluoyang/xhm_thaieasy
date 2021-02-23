import React, { useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionLogout, updateAppDrawerOpen } from '../../../store/actionCreator';
import { useHistory } from 'react-router-dom'
import utils from '../../../utils';
import { makeStyles } from "@material-ui/core/styles";
import {Box, AppBar, Toolbar, Hidden, Link, IconButton, Typography, Menu, MenuItem, Avatar } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import logoImg from '../../../assets/imgs/logo.png';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import AccountCircle from "@material-ui/icons/AccountCircle";
import Fade from '@material-ui/core/Fade';

// 导航栏链接组件
function NavLinkPanel(props) {

    let list = [
        {
            title: `首页`,
            type: 0, // 0 应用内链接  1应用外链接
            link: '/',
        },
        {
            title: `如何使用`,
            type: 0, // 0 应用内链接  1应用外链接
            link: '/article/123',
        },
        {
            title: `联系我们`,
            type: 0, // 0 应用内链接  1应用外链接
            link: '/contactus',
        },
        {
            title: `管理系统`,
            type: 1, // 0 应用内链接  1应用外链接
            link: 'https://www.baidu.com',
        }
    ]
    const [navList, setNavList] = useState(list)

    return (

        // 右侧导航区域
        <Box display='flex' px='20%' flexWrap='nowrap' flexGrow={1} justifyContent='space-around' alignItems='center'>

            {
                navList.map((navitem, index) => {
                    return (
                        <Link href={navitem.link} target={ navitem.type === 1 ? '_black' : '' } key={index} color="inherit">{navitem.title}</Link>
                    )
                })
            }

        </Box>
    )

}

// 导航栏组件
function NavBar(props) {

    let history = useHistory()

    // props的参数 isHome 代表为首页的导航栏
    const isHome = Boolean(props.isHome) || false

    const useStyles = makeStyles((theme) => ({
        root: {
            marginBottom: '56px',
        },
        logo: {
            width: '50px',
            height: '50px',
            marginRight: theme.spacing(2)
        },
        leftButton: {
            marginRight: theme.spacing(2),
        },
        avatar: {
            width: theme.spacing(5),
            height: theme.spacing(5),
        },
    }));

    const classes = useStyles()

    // 点击菜单按钮打开/关闭抽屉
    const clickDrawer = () => {
        // 抽屉状态取反
        let appDrawerOpen = props.appConfig.appDrawerOpen
        props.updateAppDrawerOpen(!appDrawerOpen)
    }

    const toHomePage = () => {
        history.replace('/')
    }

    // 点击返回按钮
    const goBack = () => {
        history.goBack()
    }

    const [anchorEl, setAnchorEl] = useState(null)

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget)
    };

    const closeMenu = () => {
        setAnchorEl(null)
    };

    const toLogin = () => {
        closeMenu()
        // 跳转登录页面
        history.push('/login')
    }

    const toLogout = () => {
        closeMenu()
        // 二次确认
        props.actionLogout().then(() => {
            // 登出成功
            utils.showToast(`登出成功`, 'success')
        }).catch(error => {
            // 登出失败
            utils.showToast(`登出失败`, 'fail')
        })
    }

    return (

        <div className={classes.root} >

            <AppBar position="fixed">
                <Toolbar>

                    {/* 左侧菜单按钮 md以上隐藏 */}
                    <Hidden mdUp>
                        <IconButton edge="start" className={classes.leftButton} color="inherit" aria-label={isHome ? 'Home' : 'Menu'} onClick={isHome ? clickDrawer : goBack}>{ isHome ? <MenuIcon /> : <NavigateBeforeIcon /> }</IconButton>
                    </Hidden>

                    {/* logo  md以下隐藏 */}
                    <Hidden mdDown>
                        <img className={classes.logo} src={logoImg} alt={props.appConfig.appName} onClick={toHomePage} />
                    </Hidden>
                    
                    {/* 标题 */}
                    <Typography variant="h6">{isHome ? props.appConfig.appName : (props.navtitle || '')}</Typography>

                    {/* 导航区域 md以下隐藏 */}
                    <Hidden mdDown>
                        {<NavLinkPanel {...props}></NavLinkPanel>}
                    </Hidden>

                    {/* 右侧按钮区域  md以下隐藏*/}
                    <Hidden mdDown>
                        <Box display='flex' justifyContent='flex-end' alignItems='center' className='btndiv'>
                            {/* 用户头像按钮 */}
                            <IconButton
                                aria-label="User"
                                aria-controls="account-appbar"
                                aria-haspopup="true"
                                onClick={openMenu}
                                color="inherit"
                            >
                                {
                                    props.appUser.user ?
                                        <Avatar className={classes.avatar} src={props.appConfig.imgUrl + props.appUser.user.avatar}></Avatar>
                                        :
                                        <AccountCircle />
                                }
                            </IconButton>
                            
                            {/* 弹出popup的menu */}
                            <Menu
                                id="account-appbar"
                                anchorEl={anchorEl}
                                keepMounted
                                TransitionComponent={Fade}
                                open={Boolean(anchorEl)}
                                onClose={closeMenu}
                            >
                                {
                                    !props.appUser.user && <MenuItem onClick={toLogin}>登录</MenuItem>
                                }
                                {
                                    props.appUser.user && <MenuItem onClick={toLogout}>登出</MenuItem>
                                }
                            </Menu>
                        </Box>
                    </Hidden>

                </Toolbar>
            </AppBar>

        </div>

    )

}

const mapStateToProps = (state, ownprops) => {
    return {...ownprops, ...state}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ actionLogout,updateAppDrawerOpen }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);