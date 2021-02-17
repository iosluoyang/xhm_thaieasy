import React, { useState } from "react";
import { useHistory, useLocation } from 'react-router-dom'
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from "@material-ui/icons/AccountCircle";
import Fade from '@material-ui/core/Fade';
import AppDrawer from '../drawer/index';

function NavRightPanel(props) {

    let history = useHistory()

    const [anchorEl, setAnchorEl] = useState(null);

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

    return (
        <div>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle />
            </IconButton>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                TransitionComponent={Fade}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleLogin}>登录</MenuItem>
                <MenuItem onClick={handleClose}>我的账户</MenuItem>
            </Menu>
        </div>
    )

}

function NavBar() {

    const useStyles = makeStyles((theme) => ({
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
        },
    }));

    const classes = useStyles();

    // 初始值为关闭drawer
    const [openDrawer, setOpenDrawer] = useState(false)

    // 子组件关闭传递当前开关状态
    const ToggleDrawer = (open) => {

        // 将当前状态取反
        setOpenDrawer(!openDrawer)
    }

    return (

        <div className={classes.root}>

            <AppBar position="fixed">
                <Toolbar>
                    {/* 左侧菜单按钮 */}
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={ToggleDrawer}>
                        <MenuIcon />
                    </IconButton>

                    {/* 标题 */}
                    <Typography variant="h6" className={classes.title}>ThaiEasy泰易贝</Typography>

                    {/* 右侧icon区域 */}
                    <NavRightPanel></NavRightPanel>

                </Toolbar>
            </AppBar>

            {/* 侧边栏弹出框 */}
            <AppDrawer direction="left" open={openDrawer} onToggleDrawer={ToggleDrawer}></AppDrawer>

        </div>

    )

}

export default NavBar;