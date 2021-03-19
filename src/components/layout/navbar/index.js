import React, { useState } from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionLogout, updateAppDrawerOpen } from '../../../store/actionCreator';
import { useHistory } from 'react-router-dom'
import utils from '../../../utils';
import { makeStyles, fade } from "@material-ui/core/styles";
import { Box, AppBar, Toolbar, InputBase, Hidden, Link, IconButton, Typography, Menu, MenuItem, Avatar } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import logoImg from '../../../assets/imgs/logo.png';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from "@material-ui/icons/AccountCircle";
import TelegramIcon from '@material-ui/icons/Telegram';
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
                        <Link href={navitem.link} target={navitem.type === 1 ? '_black' : ''} key={index} color="inherit">{navitem.title}</Link>
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

    // props的参数 isSearch 代表带有搜索框的导航栏
    const isSearch = Boolean(props.isSearch) || false

    const useStyles = makeStyles((theme) => ({
        root: {
            top: 0,
            left: 0,
            right: 0,
        },
        logo: {
            width: '50px',
            height: '50px',
            marginRight: theme.spacing(2)
        },
        leftButton: {
            marginRight: theme.spacing(1),
        },
        navtitle: {
            fontSize: theme.typography.pxToRem(15),
            fontWeight: 'bold',
            flexShrink: 0,
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15),
            '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: theme.spacing(2),
            flexGrow: 1,
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
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

    const [searchText, setSearchText] = useState(props.search && props.search.defaultValue ? props.search.defaultValue : '')
    const searchChange = (e) => {
        let searchText = e.target.value
        setSearchText(searchText)
    }

    const startToSearch = () => {
        // if (searchText) props.onStartToSearch(searchText)
        props.onStartToSearch(searchText)
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
        history.push('/account/login')
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

        <AppBar className={classes.root} position="fixed">
            <Toolbar>

                {/* 左侧菜单按钮 md以上隐藏 */}
                <Hidden mdUp>
                    <IconButton edge="start" className={classes.leftButton} color="inherit" aria-label={isHome ? 'Home' : 'Menu'} onClick={isHome ? clickDrawer : goBack}>{isHome ? <MenuIcon /> : <NavigateBeforeIcon />}</IconButton>
                </Hidden>

                {/* logo  md以下隐藏 */}
                <Hidden mdDown>
                    <img className={classes.logo} src={logoImg} alt={props.appConfig.appName} onClick={toHomePage} />
                </Hidden>

                {/* 标题 */}
                <Typography noWrap className={classes.navtitle}>{isHome ? props.appConfig.appName : (props.navtitle || '')}</Typography>

                {/* 搜索框 md以上隐藏 */}
                <Hidden mdUp>

                    {
                        isSearch &&
                        <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon />
                            </div>
                            <InputBase
                                type='search'
                                placeholder={`${props.search && props.search.placeholder ? props.search.placeholder : '搜索'}`}
                                autoFocus={props.search && props.search.autoFocus ? props.search.autoFocus : false}
                                defaultValue={props.search && props.search.defaultValue ? props.search.defaultValue : ''}
                                onChange={searchChange}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{ 'aria-label': 'search' }}
                                endAdornment={<TelegramIcon position='end' onClick={startToSearch} />}
                            />
                        </div>
                    }

                </Hidden>

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

    )

}

const mapStateToProps = (state, ownprops) => {
    return { ...ownprops, ...state }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ actionLogout, updateAppDrawerOpen }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar);