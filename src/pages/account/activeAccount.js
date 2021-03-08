import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Box, Container, Typography } from '@material-ui/core';
import { activeaccountapi } from '../../api/userapi';
import utils from '../../utils';

function ActiveAccnount(props) {

    const history = useHistory()
    const { code } = useParams()
    console.log(`当前要激活的账号验证码为:${code}`)

    useEffect(() => {

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

    }, [])

    return (
        <Box padding={8} display='flex' justifyContent='center'>
            <Typography variant='overline' color='textSecondary'>{`${'激活账号'}`}</Typography>

        </Box>
    )

}

export default ActiveAccnount