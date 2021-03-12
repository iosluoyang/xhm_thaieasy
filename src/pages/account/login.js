import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionLogin } from '@/store/actionCreator';
import { sendsetpwdemailapi } from '@/api/userapi';
import NavBar from "@/components/layout/navbar";
import { Box, Container, Grid, TextField, Button, FormControl, InputAdornment, InputLabel, Input, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import utils from '@/utils';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import md5 from 'js-md5';

function Login(props) {

    const useStyles = makeStyles(theme => ({

        root: {
            paddingTop: '30px'
        },
        width100: {
            width: '100%'
        }
    }))
    const classes = useStyles()

    const history = useHistory()

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [showPwd, setShowPwd] = useState(false)

    const typeEmail = (event) => {
        setEmail(event.target.value)
    }
    const typePwd = (event) => {
        setPwd(event.target.value)
    }

    // 注册账号
    const registerAccount = () => {
        history.push('/account/register')
    }

    const [openDialog, setOpenDialog] = useState(false) // 是否打开dialog
    const [findEmail, setFindEmail] = useState('') // 忘记密码的邮箱地址

    // 发送忘记密码的邮件
    const sendForgetEmail = () => {

        if (!findEmail) {
            utils.showToast(`${'请输入正确的邮箱地址'}`, 'error')
            return
        }

        // 开始发送邮件
        sendsetpwdemailapi({ email: findEmail }).then(response => {
            // 发送邮件成功

            // 首先关闭弹框
            setOpenDialog(false)
            // 清空email
            setFindEmail('')

            utils.showToast(`${'一封邮件已经发送到您的邮箱,请注意查收'}`, 'success')

        }).catch(error => {

            utils.showToast(error.msg, 'error')

        })


    }

    // 登录
    const login = () => {

        // 检查数据
        if (!email) {
            utils.showToast('请输入邮箱地址', 'info')
            return
        }
        else if (!pwd) {
            utils.showToast('请输入密码', 'info')
            return
        }

        utils.showLoading(true)

        // 调用登录接口
        let data = {
            email: email,
            pwd: md5(pwd)
        }
        props.actionLogin(data).then(response => {
            utils.showLoading(false)
            utils.showToast('登录成功', 'success')
            // 登录成功 跳转页面
            history.goBack()
        }).catch(error => {
            utils.showLoading(false)
            // 账号未激活
            if (error.errorCode === 'E10030') {
                utils.showDialog(`${'提示'}`, `${`该邮箱${email}暂未激活,请前往邮箱进行激活`}`, 'normal')
            }
            else {
                utils.showToast(error.msg || error, 'error')
            }
        })

    }

    return (

        <Box className={classes.root}>

            {/* 导航栏 */}
            <NavBar navtitle={`登录`}></NavBar>

            {/* 填写的内容区域 */}
            <Container maxWidth='sm'>

                {/* 登录填写的内容区域 */}
                <Grid container direction='column' spacing={3} justify="flex-start" alignItems='stretch'>

                    {/* 邮箱 */}
                    <Grid item>

                        <Grid container spacing={2} justify="center" alignItems="flex-end">
                            <Grid item xs={2}>
                                <AccountBoxIcon />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField id="account" label={`${'邮箱'}`} value={email} onChange={typeEmail} />
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
                                <FormControl>
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

                    {/* 注册&忘记密码 */}
                    <Grid item>
                        <Grid container justify='space-between' alignItems='center'>

                            {/* 注册 */}
                            <Grid item xs={5}>
                                <Button className={classes.width100} onClick={registerAccount}>{`注册账号`}</Button>
                            </Grid>

                            {/* 忘记密码 */}
                            <Grid item xs={5}>
                                <Button className={classes.width100} onClick={() => { setOpenDialog(true) }}>{`忘记密码`}</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* 登录按钮 */}
                    <Grid item>
                        <Button className={classes.width100} variant="contained" color="primary" onClick={utils.throttle(login)} >
                            {`登录`}
                        </Button>
                    </Grid>

                </Grid>

            </Container>

            {/* 可输入的弹出框 */}
            <Dialog open={openDialog} onClose={() => { setOpenDialog(false) }}>

                <DialogTitle>{`${'忘记密码'}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{`${`请输入您的邮箱地址,点击邮件中的链接进行重置密码`}`}</DialogContentText>
                    <TextField autoFocus margin='dense' fullWidth value={email} onChange={(e) => { setFindEmail(e.target.value) }}></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setOpenDialog(false) }} color='secondary'>
                        {`${'取消'}`}
                    </Button>
                    <Button onClick={sendForgetEmail} color="primary">
                        {`${'确定'}`}
                    </Button>
                </DialogActions>

            </Dialog>

        </Box>

    )

}

const mapStateToProps = (state, ownprops) => {
    return {
        appName: state.appConfig.appName
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ actionLogin }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
