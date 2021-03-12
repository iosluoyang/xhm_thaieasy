import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { setpwdapi } from "@/api/userapi";
import utils from '@/utils';
import { Box, Container, Grid, TextField, Button, FormControl, InputAdornment, InputLabel, Input, IconButton, Typography, Icon } from '@material-ui/core';
import { makeStyles } from '@material-ui//core/styles';
import submitSuccessImg from '@/assets/imgs/base/submitsuccess.png';
import { MailOutline, VpnKey, Visibility, VisibilityOff } from '@material-ui/icons';


export default function ForgetPwd(props) {

    const history = useHistory()
    const { type, code } = useParams()
    console.log(`当前密码操作类型为:${type}code为${code}`)

    const useStyles = makeStyles((theme) => ({
        root: {
            paddingTop: '30px',
            height: '100vh',
            boxSizing: 'border-box'
        },

        width100: {
            width: '100%'
        },
        doneImg: {
            width: '100%',
            height: 'auto',
            objectFit: 'contain'
        }

    }))
    const classes = useStyles()

    const [pageType, setPageType] = useState(type) // 页面类型 handlepwd为重置密码  done为已完成  默认为handlepwd
    const [email, setEmail] = useState('')
    const [privateCode, setPrivateCode] = useState(code)
    const [pwd, setPwd] = useState()
    const [showPwd, setShowPwd] = useState(false)
    const [confirmPwd, setConfirmPwd] = useState('')
    const [showConfirmPwd, setShowConfirmPwd] = useState(false)

    const typeEmail = (e) => {
        setEmail(e.target.value)
    }
    const typePwd = (e) => {
        setPwd(e.target.value)
    }
    const typeConfirmPwd = (e) => {
        setConfirmPwd(e.target.value)
    }

    // 点击确认
    const confirm = () => {

        // 检查数据
        if (!email) {
            utils.showToast(`请输入邮箱`, 'info')
            return
        }
        else if (!pwd || !confirmPwd) {
            utils.showToast(`请输入密码`, 'info')
            return
        }
        else if (pwd !== confirmPwd) {
            utils.showToast(`两次密码不一致`, 'info')
            return
        }
        else if (!privateCode) {
            utils.showToast(`${'验证码失效，请重试'}`, 'error')
            return
        }

        // 数据校验完毕 开始调用接口
        let data = {
            code: privateCode,
            email: email,
            pwd: utils.md5(pwd)
        }

        setpwdapi(data).then(response => {
            // 重置成功
            setPageType('done')
            utils.showDialog(`${'提示'}`, `${'密码重置成功！现在您可以使用新密码登录您的账号'}`, 'normal')

        }).catch(error => {
            // 重置失败
            utils.showToast(error.msg, 'error')
        })

    }

    return (
        <Box className={classes.root}>

            {/* 填写的内容区域 */}
            <Container maxWidth='sm'>

                {/* 标题 */}
                <Typography style={{ textAlign: 'center' }} variant='h6' color='textPrimary'>
                    {`${pageType === 'handlepwd' ? '重置密码' : '重置成功!'}`}
                </Typography>

                {/* 注册填写的内容区域 */}
                {
                    pageType === 'handlepwd' &&
                    <Grid container direction='column' spacing={3} justify="flex-start" alignItems='stretch'>

                        {/* 邮箱 */}
                        <Grid item>

                            <Grid container spacing={2} justify="center" alignItems="flex-end">
                                <Grid item xs={2}>
                                    <MailOutline />
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField required id="email" variant='standard' label={`${'邮箱'}`} value={email} onChange={typeEmail} />
                                </Grid>
                            </Grid>

                        </Grid>

                        {/* 密码 */}
                        <Grid item>

                            <Grid container spacing={2} justify="center" alignItems="flex-end">

                                <Grid item xs={2}>
                                    <VpnKey />
                                </Grid>
                                <Grid item xs={9}>

                                    {/* 密码 */}
                                    <FormControl required>
                                        <InputLabel>{`密码`}</InputLabel>
                                        <Input
                                            type={showPwd ? 'text' : 'password'}
                                            value={pwd}
                                            onChange={typePwd}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={() => { setShowPwd(!showPwd) }}
                                                        onMouseDown={() => { setShowPwd(!showPwd) }}
                                                    >
                                                        {showPwd ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        />
                                    </FormControl>

                                </Grid>

                            </Grid>

                        </Grid>

                        {/* 密码确认 */}
                        <Grid item>

                            <Grid container spacing={2} justify="center" alignItems="flex-end">

                                <Grid item xs={2}>
                                    <VpnKey />
                                </Grid>
                                <Grid item xs={9}>
                                    {/* 确认密码 */}
                                    <FormControl required>
                                        <InputLabel>{`确认密码`}</InputLabel>
                                        <Input type={showConfirmPwd ? 'text' : 'password'}
                                            value={confirmPwd}
                                            onChange={typeConfirmPwd}
                                            endAdornment={
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => { setShowConfirmPwd(!showConfirmPwd) }}
                                                        onMouseDown={() => { setShowConfirmPwd(!showConfirmPwd) }}
                                                    >

                                                        {showConfirmPwd ? <Visibility /> : <VisibilityOff />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                        ></Input>
                                    </FormControl>
                                </Grid>

                            </Grid>

                        </Grid>

                        {/* 确定按钮 */}
                        <Grid item>
                            <Button className={classes.width100} variant="contained" color="primary" onClick={utils.throttle(confirm)} >
                                {`${'确定'}`}
                            </Button>
                        </Grid>

                    </Grid>
                }

                {/* 提交成功页面类型 */}
                {
                    pageType === 'done' && <img className={classes.doneImg} src={submitSuccessImg}></img>
                }


            </Container>

        </Box>
    )

}