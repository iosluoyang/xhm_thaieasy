import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import utils from '../../utils';
import md5 from 'js-md5';
import { registerapi, sendactiveapi, activeaccountapi } from "../../api/userapi";
import NavBar from '../../components/layout/navbar';
import { Box, Container, Grid, TextField, Button, FormControl, InputAdornment, InputLabel, Input, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui//core/styles';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import PhoneIcon from '@material-ui/icons/Phone';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


export default function Register(props) {

    const history = useHistory()

    const useStyles = makeStyles((theme) => ({
        root: {
            paddingTop: '30px'
        },

        width100: {
            width: '100%'
        }

    }))

    const classes = useStyles()

    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [userName, setUserName] = useState('')
    const [pwd, setPwd] = useState('')
    const [showPwd, setShowPwd] = useState(false)
    const [confirmPwd, setConfirmPwd] = useState('')
    const [showConfirmPwd, setShowConfirmPwd] = useState(false)

    const typeEmail = (e) => {
        setEmail(e.target.value)
    }
    const typePhone = (e) => {
        setPhone(e.target.value)
    }
    const typeUserName = (e) => {
        setUserName(e.target.value)
    }
    const typePwd = (e) => {
        setPwd(e.target.value)
    }
    const typeConfirmPwd = (e) => {
        setConfirmPwd(e.target.value)
    }

    // 注册事件
    const register = () => {

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

        // 数据校验完毕 开始调用接口
        let data = {
            phone: phone,
            email: email,
            userName: userName,
            pwd: md5(pwd)
        }

        registerapi(data).then(response => {
            // 注册成功

            utils.showDialog(`提示`, `注册成功,激活邮件已经发送到您的邮箱,请尽快进行激活,激活后即可使用邮箱登陆`, 'normal', (callbackdata) => {
                if (callbackdata.type == 'confirm') {
                    // 点击了确认  返回上一个页面
                    history.goBack()
                }
            })

        }).catch(error => {

            // 该邮箱已经注册  是否重新发送激活码
            if (error.errorCode === 'E10030') {
                utils.showDialog(`${'提示'}`, `${'该邮箱已经注册但未激活,是否重新发送激活邮件?'}`, 'confirm', (callbackdata) => {
                    if (callbackdata.type === 'confirm') {
                        // 重新发送激活邮件
                        sendactiveapi({ email: email }).then(response => {
                            // 发送成功
                            utils.showDialog(`提示`, `注册成功！激活码已经发送到您的邮箱,请尽快进行激活,激活后可使用该邮箱登陆。现在是否进行手动激活?`, 'confirm', (callbackdata) => {
                                if (callbackdata.type == 'confirm') {
                                    // 点击了确认  进行手动激活
                                    setOpenDialog(true)
                                }
                                else {
                                    history.goBack()
                                }
                            })
                        }).catch(error => {
                            // 发送失败
                            utils.showToast(error.msg, 'error')
                        })
                    }
                })
            }
            else {
                utils.showToast(error.msg, 'error')
            }

        })

    }


    // 激活相关
    const [openDialog, setOpenDialog] = useState(false)
    const [activeCode, setActiveCode] = useState('')
    const typeActiveCode = (e) => {
        let activeCode = e.target.value
        setActiveCode(activeCode)
    }
    const activeAccount = () => {

        // 开始激活账号
        let data = {
            email: email,
            code: activeCode
        }
        activeaccountapi(data).then(response => {
            // 激活成功 返回登录页面
            setOpenDialog(false) // 关闭弹框

            utils.showToast(`${'激活成功,请直接登录'}`, 'success')
            setTimeout(() => {
                history.goBack()
            }, 1500);

        }).catch(error => {
            // 激活失败
            utils.showToast(error.msg, 'error')
        })

    }

    return (
        <Box className={classes.root}>

            {/* 导航栏 */}
            <NavBar navtitle={`注册`}></NavBar>

            {/* 填写的内容区域 */}
            <Container maxWidth='sm'>

                {/* 注册填写的内容区域 */}
                <Grid container direction='column' spacing={3} justify="flex-start" alignItems='stretch'>

                    {/* 邮箱 */}
                    <Grid item>

                        <Grid container spacing={2} justify="center" alignItems="flex-end">
                            <Grid item xs={2}>
                                <MailOutlineIcon />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField required id="email" variant='standard' label={`邮箱`} value={email} onChange={typeEmail} />
                            </Grid>
                        </Grid>

                    </Grid>

                    {/* 密码 */}
                    <Grid item>

                        <Grid container spacing={2} justify="center" alignItems="flex-end">

                            <Grid item xs={2}>
                                <VpnKeyIcon />
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
                                <VpnKeyIcon />
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

                    {/* 手机号 */}
                    <Grid item>

                        <Grid container spacing={2} justify="center" alignItems="flex-end">
                            <Grid item xs={2}>
                                <PhoneIcon />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField id="phone" variant='standard' label={`手机号`} value={phone} onChange={typePhone} />
                            </Grid>
                        </Grid>

                    </Grid>

                    {/* 用户昵称 */}
                    <Grid item>

                        <Grid container spacing={2} justify="center" alignItems="flex-end">
                            <Grid item xs={2}>
                                <AccountBoxIcon />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField id="username" variant='standard' label={`昵称`} value={userName} onChange={typeUserName} />
                            </Grid>
                        </Grid>

                    </Grid>

                    {/* 注册按钮 */}
                    <Grid item>
                        <Button className={classes.width100} variant="contained" color="primary" onClick={utils.throttle(register, 300)}>{`${'注册'}`}</Button>
                    </Grid>

                </Grid>

            </Container>


            {/* 可输入的弹出框 */}
            <Dialog open={openDialog} onClose={() => { setOpenDialog(false) }}>

                <DialogTitle>提示</DialogTitle>
                <DialogContent>
                    <DialogContentText>{`${`请输入邮箱${email}中的激活码,点击确定进行激活`}`}</DialogContentText>
                    <TextField autoFocus margin='dense' fullWidth value={activeCode} onChange={typeActiveCode}></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenDialog(false); history.goBack() }} color='secondary'>
                        {`${'取消'}`}
                    </Button>
                    <Button onClick={activeAccount} color="primary">
                        {`${'确定'}`}
                    </Button>
                </DialogActions>

            </Dialog>

        </Box>
    )

}