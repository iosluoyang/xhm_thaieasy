import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Box, Container, Typography, Button } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { activeaccountapi } from '../../api/userapi';
import utils from '../../utils';

function ActiveAccnount(props) {

    const history = useHistory()
    const { code } = useParams()
    console.log(`当前要激活的账号验证码为:${code}`)

    const useStyles = makeStyles((theme) => ({
        root: {
            height: '100vh',
            boxSizing: 'border-box',
            background: `url(${require('../../assets/imgs/welcome.png')}) no-repeat left bottom`,
            backgroundSize: 'contain'
        }
    }))
    const classes = useStyles()
    const theme = useTheme()

    // 手动激活账号
    const activeAccount = () => {

        // 开始调用接口进行账号激活
        if (code) {
            activeaccountapi({ code }).then(response => {
                // 激活成功
                utils.showDialog(`${'激活成功'}`, `${'欢迎成为我们的一员,现在您可以通过账号或者邮箱登录该账号来进行使用'}`, 'normal', (callBack) => {
                    // 跳转登录页面
                    history.replace('/account/login')
                })
            }).catch(error => {
                utils.showToast(`${'激活失败:' + JSON.stringify(error.msg)}`, 'error')
            })
        }
        else {
            utils.showDialog(`${'激活失败'}`, `${'暂未获取到有效的激活码,请重新注册发送激活邮件'}`, 'normal', (callBack) => {
                // 跳转登录页面
                history.replace('/account/register')
            })
        }

    }

    useEffect(() => {

        // 开始激活账号
        activeAccount()

    }, [])

    return (
        <Box className={classes.root} height='100vh' paddingX={2} paddingY={10} boxSizing='border-box' textAlign='center' bgcolor='warning.main'>

            <Typography component='div'>
                <Box color='#FFFFFF' fontWeight='fontWeightLight'>{`${'欢迎加入ThaiEasy'}`}</Box>
            </Typography>

            <Box marginTop={10}>
                <Button variant='contained' color='primary' onClick={activeAccount}>{`${'手动激活账号'}`}</Button>
            </Box>

        </Box>
    )

}

export default ActiveAccnount