import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionLogin } from '@/store/actionCreator';
import { sendsetpwdemailapi, sendactiveapi } from '@/api/userapi';
import NavBar from "@/components/layout/navbar";
import { Box, Container, Grid, TextField, RadioGroup, Radio, Button, FormControl, InputAdornment, InputLabel, Input, IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormLabel, FormControlLabel } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { AccountBox, VpnKey, Visibility, VisibilityOff } from '@material-ui/icons'
import utils from '@/utils';

function Login(props) {

    const history = useHistory()
    const location = useLocation()
    const search = location.search
    let searchParam = utils.queryString.parse(search)
    let redirectPath = searchParam ? searchParam.redirectPath : null // 重定向地址

    const theme = useTheme()
    const useStyles = makeStyles(theme => ({

        root: {
            paddingTop: '80px',
            boxSizing: 'border-box'
        },
        width100: {
            width: '100%'
        }
    }))
    const classes = useStyles()


    const [userType, setUserType] = useState(1) // 用户身份类型  0超级管理员 1普通用户  2系统管理员  默认为普通用户

    const [email, setEmail] = useState('')
    const [account, setAccount] = useState('')
    const [pwd, setPwd] = useState('')
    const [showPwd, setShowPwd] = useState(false)

    const typeEmail = (event) => {
        setEmail(event.target.value)
    }
    const typeAccount = (event) => {
        setAccount(event.target.value)
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

    // 发送激活账号的邮件
    const sendActiveAccountEmail = () => {

        // 重新发送激活邮件
        sendactiveapi({ email: email }).then(response => {
            // 发送成功
            utils.showDialog(``, `激活邮件已经发送到您的邮箱,请尽快进行激活,激活后可使用该邮箱登陆。`, 'normal')
        }).catch(error => {
            // 发送失败
            utils.showToast(error.msg, 'error')
        })

    }

    // 登录
    const login = () => {

        // 检查数据

        if (userType === 1 && !email) {
            utils.showToast('请输入邮箱地址', 'info')
            return
        }
        else if ((userType === 0 || userType === 2) && !account) {
            utils.showToast('请输入账号', 'info')
            return
        }
        else if (!pwd) {
            utils.showToast('请输入密码', 'info')
            return
        }

        utils.showLoading(true)

        // 调用登录接口
        let data = Object.assign({}, { pwd: utils.md5(pwd) }, userType === 1 ? { email: email } : { account: account })
        props.actionLogin(data).then(response => {

            utils.showLoading(false)
            utils.showToast('登录成功', 'success')
            // 登录成功 根据是否有重定向链接选择跳转的路径
            if (redirectPath) {
                history.replace(redirectPath)
            }
            else {
                history.goBack()
            }

        }).catch(error => {
            utils.showLoading(false)
            // 账号未激活
            if (error.errorCode === 'E10030') {
                utils.showDialog(`${'提示'}`, `${`该邮箱${email}暂未激活,请前往邮箱进行激活。如您找不到激活邮件,是否重新发送激活邮件?`}`, 'confirm', (callbackData) => {
                    if (callbackData.type === 'confirm') {
                        // 重新发送激活邮件
                        sendActiveAccountEmail()
                    }
                })
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

                {/* 身份类型 */}
                <FormControl style={{ paddingLeft: theme.spacing(2) }}>
                    <FormLabel>{`${'身份类型'}`}</FormLabel>
                    <RadioGroup row value={userType} onChange={(e) => { setUserType(parseInt(e.target.value)) }}>

                        <FormControlLabel value={1} control={<Radio />} label={`${'普通用户'}`}></FormControlLabel>
                        <FormControlLabel value={2} control={<Radio />} label={`${'系统管理员'}`}></FormControlLabel>

                    </RadioGroup>

                </FormControl>

                {/* 登录填写的内容区域 */}
                <Grid container direction='column' spacing={3} justify="flex-start" alignItems='stretch'>

                    {/* 邮箱(用户身份时) */}
                    {
                        userType === 1 &&
                        <Grid item>

                            <Grid container spacing={2} justify="center" alignItems="flex-end">
                                <Grid item xs={2}>
                                    <AccountBox />
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField id="email" label={`${'邮箱'}`} value={email} onChange={typeEmail} />
                                </Grid>
                            </Grid>

                        </Grid>
                    }

                    {/* 账号(管理员) */}
                    {
                        (userType === 0 || userType === 2) &&
                        <Grid item>

                            <Grid container spacing={2} justify="center" alignItems="flex-end">
                                <Grid item xs={2}>
                                    <AccountBox />
                                </Grid>
                                <Grid item xs={9}>
                                    <TextField id="account" label={`${'账号'}`} value={account} onChange={typeAccount} />
                                </Grid>
                            </Grid>

                        </Grid>
                    }

                    {/* 密码 */}
                    <Grid item>

                        <Grid container spacing={2} justify="center" alignItems="flex-end">

                            <Grid item xs={2}>
                                <VpnKey />
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
                    <TextField autoFocus margin='dense' fullWidth value={findEmail} onChange={(e) => { setFindEmail(e.target.value) }}></TextField>
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
