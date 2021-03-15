import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { Box, Container, Typography, Button, CircularProgress } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { activeaccountapi } from '@/api/userapi';
import utils from '@/utils';
import welcomeGirl from '@/assets/imgs/welcome/girl.png';
import welcomeFlower from '@/assets/imgs/welcome/flower.png';
import welcomeBoy from '@/assets/imgs/welcome/boy.png';


function ActiveAccnount(props) {

    const history = useHistory()
    const { code } = useParams()
    console.log(`当前要激活的账号验证码为:${code}`)

    const useStyles = makeStyles((theme) => ({
        root: {
            height: '100vh',
            boxSizing: 'border-box',
            background: `url(${welcomeGirl}),url(${welcomeFlower}),url(${welcomeBoy})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'left bottom, center center, right bottom',
            backgroundSize: '50% auto, 60%, 50% auto'
        }
    }))
    const classes = useStyles()

    const [tipStr, setTipStr] = useState(`${'正在激活账号……'}`)
    const [loading, setLoading] = useState(false)
    const [showActiveBtn, setShowActiveBtn] = useState(false)

    // 手动激活账号
    const activeAccount = () => {

        // 开始调用接口进行账号激活
        if (code) {
            setLoading(true) // 开始缓冲
            setShowActiveBtn(false) // 隐藏按钮

            activeaccountapi({ code }).then(response => {
                // 激活成功
                // utils.showDialog(`${'激活成功'} `, `${'欢迎成为我们的一员,现在您可以通过账号或者邮箱登录该账号来进行使用'} `, 'normal', (callBack) => {
                //     // 跳转登录页面
                //     history.replace('/account/login')
                // })
                setLoading(false) // 结束缓冲
                setTipStr(`${'该账号已经激活成功!'}`)
                setShowActiveBtn(false)
            }).catch(error => {
                setLoading(false)
                setTipStr(`${'激活失败,请尝试手动激活'}`)
                setShowActiveBtn(true)
                utils.showToast(`${'激活失败:' + JSON.stringify(error.msg)} `, 'error')
            })
        }
        else {
            setTipStr(`${'激活失败'}`)
            utils.showDialog(`${'激活失败'} `, `${'暂未获取到有效的激活码,请重新注册发送激活邮件'} `, 'normal', (callBack) => {
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
        <Box className={classes.root} paddingX={2} paddingY={10} textAlign='center'>

            <Typography component='div'>
                <Box color='primary' fontWeight='fontWeightLight' marginBottom={5}>{tipStr}</Box>
            </Typography>
            {
                loading && <CircularProgress color='secondary' />
            }

            {
                showActiveBtn &&
                <Box marginTop={10}>
                    <Button variant='contained' color='primary' onClick={utils.throttle(activeAccount)}>{`${'手动激活账号'} `}</Button>
                </Box>
            }

        </Box>
    )

}

export default ActiveAccnount