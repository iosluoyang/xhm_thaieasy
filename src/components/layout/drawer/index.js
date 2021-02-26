import React, { useState } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { useHistory} from 'react-router-dom';
import { updateAppDrawerOpen, actionLogout } from '../../../store/actionCreator';
import utils from '../../../utils';
import { Box, SwipeableDrawer,Avatar, Chip, List, ListItem, ListItemIcon, ListItemText, Divider } from "@material-ui/core";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import clsx from 'clsx';
import { AccountCircle, Home, LiveHelp, ContactSupport, CardGiftcard, Settings, ExitToApp } from '@material-ui/icons';

function AppDrawer(props) {

    let history = useHistory()

    const useStyles = makeStyles((theme) => ({
        avatar: {
            width: theme.spacing(6),
            height: theme.spacing(6),
        },
        list: {
            width: 250,
        },
        fullList: {
            width: 'auto'
        }
    }))

    const classes = useStyles()
    const theme = useTheme()

    const originalFirstDataList = [
        {
            icon: <Home />,
            title: `${'首页'}`,
            link: '/'
        },
        {
            icon: <LiveHelp />,
            title: `${'如何使用'}`,
            link: '/article/123'
        },
        {
            icon: <ContactSupport />,
            title: `${'联系我们'}`,
            link: '/contactus'
        },
        {
            icon: <CardGiftcard />,
            title: `${'加入我们'}`,
            link: '/joinus'
        }
    ]
    const [dataList1, setDataList1] = useState(originalFirstDataList)

    // 点击列表项
    const clickListItem = (listitem) => (event) => {
        // 根据link属性进行跳转
        history.push(listitem.link)
    }

    // 点击关闭drawer
    const toggleDrawer = (appDrawerOpen) => (event) => {
        props.updateAppDrawerOpen(appDrawerOpen)
    }

    // 点击跳转登录
    const toLogin = () => {
        // 关闭抽屉
        history.push('/login')
    }

    // 登出
    const toLogout = () => {
        // 二次确认
        utils.showDialog(`${''}`,`${'确定登出吗?'}`,'confirm', (data) => {
            if(data.type == 'confirm') {
                // 进行登出
                props.actionLogout().then(() => {
                // 登出
                utils.showToast(`登出成功`, 'success')}).catch(error => {utils.showToast(`登出失败`, 'fail')})
            }
        })
        
    }

    // 跳转设置页面
    const toSetting = () => {
        history.push('/setting')
    }

    const list = (direction) => (
        <Box
            className={clsx(classes.list, {
                [classes.fullList]: direction === 'top' || direction === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >

            {/* 用户信息区域 */}
            <Box className='drawerUserDiv'>
                {
                    props.appUser.user ?

                    // 登录状态下
                    <Box display='flex' padding='10%' flexDirection='column' justifyContent='flex-start' alignItems='center'>
                        {/* 用户头像 */}
                        <Avatar className={classes.avatar} src={props.appConfig.imgUrl + props.appUser.user.avatar}></Avatar>
                        {/* 用户名称 */}
                        <Box marginY={2} textAlign='center' fontSize='15px' lineHeight='20px' whiteSpace='normal'>
                            {`${props.appUser.user.userName}`}
                            {/* 用户标识 */}
                            <Chip size='small' style={{marginLeft: theme.spacing(2)}} label={ props.appUser.user.type === 0 ? `${'管理员'}` : props.appUser.user.type === 1 ? `${'客服'}` : `${'普通用户'}` }></Chip>
                        </Box>
                    </Box>
                    :
                    // 未登录状态下
                    <Box display='flex' padding='10%' flexDirection='column' justifyContent='flex-start' alignItems='center' onClick={toLogin}>
                        {/* 默认头像 */}
                        <AccountCircle fontSize='large' />
                        {/* 默认名称 */}
                        <Box marginTop={2} textAlign='center' fontSize='15px' lineHeight='20px' borderBottom={1} borderColor='#ededed' whiteSpace='normal'>{`请先登录`}</Box>
                    </Box>

                }
            </Box>
            
            <Divider />

            {/* 列表区域 */}
            <List className="firstList">
                {dataList1.map((listitem, index) => (
                    <ListItem button key={index} onClick={clickListItem(listitem)}>
                        <ListItemIcon>{listitem.icon}</ListItemIcon>
                        <ListItemText primary={listitem.title} />
                    </ListItem>
                ))}
            </List>
            
            <List>

                <Divider />

                {
                    props.appUser.user &&
                    <ListItem button onClick={toSetting}>
                        <ListItemIcon><Settings /></ListItemIcon>
                        <ListItemText primary={`${'设置'}`} />
                    </ListItem>
                }

                {
                    props.appUser.user && 
                    <ListItem button onClick={toLogout}>
                        <ListItemIcon><ExitToApp /></ListItemIcon>
                        <ListItemText primary={`${'退出'}`} />
                    </ListItem>
                }

            </List>
        </Box>
    )

    return (
        <SwipeableDrawer anchor={props.direction} open={props.appConfig.appDrawerOpen} onOpen={toggleDrawer(true)} onClose={toggleDrawer(false)}>
            {list(props.direction)}
        </SwipeableDrawer>
    )
}

const mapStateToProps = (state, ownprops) => {
    return {...ownprops, ...state}
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({actionLogout, updateAppDrawerOpen}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AppDrawer)