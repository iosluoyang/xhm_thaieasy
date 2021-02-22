import React, { useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionLogout } from '../../../store/actionCreator';
import { useHistory } from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles";
import { Box, AppBar, Toolbar, Hidden, Grid, GridList, IconButton, Typography, Menu, MenuItem, Avatar } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import AccountCircle from "@material-ui/icons/AccountCircle";
import Fade from '@material-ui/core/Fade';
import AppDrawer from '../drawer/index';

function NavRightPanel(props) {

    let history = useHistory()

    const [anchorEl, setAnchorEl] = useState(null);

    const useStyles = makeStyles((theme) => ({

            rightPanel: {

            },
            small: {
                width: theme.spacing(3),
                height: theme.spacing(3),
            },
        }))

    const classes = useStyles()

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        handleClose()
        // 跳转登录页面
        history.push('/login')
    }

    const logout = () => {
        handleClose()
        // 二次确认
        props.actionLogout().then(() => {
            // 登出成功
        }).catch(error => {
            // 等出失败
        })
    }

    return (

        // 右侧区域
        <Box className={classes.rightPanel}>

            {/* 导航栏 */}
            <Grid container justify='space-between' alignItems='center'>

                <Grid item>首页</Grid>
                <Grid item>商品分类</Grid>
                <Grid item>联系我们</Grid>
                <Grid item>加入我们</Grid>

            </Grid>

            {/* 按钮区域 */}
            <Hidden smUp>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    {
                        props.appUser.user ?
                            <Avatar className={classes.small} src={props.appConfig.imgUrl + props.appUser.user.avatar}></Avatar>
                            :
                            <AccountCircle />
                    }
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    keepMounted
                    TransitionComponent={Fade}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    {
                        !props.appUser.user && <MenuItem onClick={handleLogin}>登录</MenuItem>
                    }
                    {
                        props.appUser.user && <MenuItem onClick={logout}>登出</MenuItem>
                    }
                </Menu>
            </Hidden>

        </Box>
    )

}

function NavBar(props) {

    let history = useHistory()

    // props的参数 isHome 代表为首页的导航栏
    const isHome = Boolean(props.isHome) || false

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
            marginBottom: '56px',
        },
        leftButton: {
            marginRight: theme.spacing(2),
        },
        title: (props) => ({
            flexGrow: 1,
        })
    }));

    const classes = useStyles();

    // 点击返回按钮
    const goBack = () => {
        history.goBack()
    }

    // 初始值为关闭drawer
    const [openDrawer, setOpenDrawer] = useState(false)

    // 子组件关闭传递当前开关状态
    const ToggleDrawer = (open) => {

        // 将当前状态取反
        setOpenDrawer(!openDrawer)
    }

    return (

        <Box className={classes.root}>

            <AppBar position="fixed">
                <Toolbar>

                    {/* 左侧菜单按钮 sm以上隐藏 */}
                    <Hidden smUp>
                        <IconButton edge="start" className={classes.leftButton} color="inherit" aria-label={isHome ? 'Home' : 'menu'} onClick={isHome ? ToggleDrawer : goBack}>
                            {
                                isHome ? <MenuIcon /> : <NavigateBeforeIcon />
                            }
                        </IconButton>
                    </Hidden>
                   

                    {/* 标题 */}
                    <Typography variant="h6" className={classes.title}>
                        {
                            isHome ? props.appConfig.appName : (props.navtitle || '')
                        }
                    </Typography>

                    {/* 右侧区域 */}
                    <NavRightPanel {...props}></NavRightPanel>

                </Toolbar>
            </AppBar>

            {/* 侧边栏弹出框 */}
            <AppDrawer direction="left" open={openDrawer} onToggleDrawer={ToggleDrawer}></AppDrawer>

        </Box>

    )

}

const mapStateToProps = (state, ownprops) => {
    return state
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ actionLogout }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);