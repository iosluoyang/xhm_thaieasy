import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionLogin } from '../../store/actionCreator';
import NavBar from "../../components/layout/navbar";
import { Box, Container, Grid, TextField, Button, FormControl, InputAdornment, InputLabel, Input, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import utils from '../../utils';
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

    const [userName, setUserName] = useState('')
    const [pwd, setPwd] = useState('')
    const [showPwd, setShowPwd] = useState(false)

    const typeUserName = (event) => {
        setUserName(event.target.value)
    }
    const typePwd = (event) => {
        setPwd(event.target.value)
    }

    // 注册账号
    const registerAccount = () => {
        history.push('/account/register')
    }

    // 忘记密码
    const forgetPwd = () => {
        history.push('/account/forgetpwd')
    }

    const login = () => {

        // 检查数据
        if (!userName) {
            utils.showToast('请输入账号', 'info')
            return
        }
        else if (!pwd) {
            utils.showToast('请输入密码', 'info')
            return
        }

        // 调用登录接口
        let data = {
            account: userName,
            pwd: md5(pwd)
        }
        props.actionLogin(data).then(response => {
            utils.showToast('登录成功', 'success')
            // 登录成功 跳转页面
            history.goBack()
        }).catch(error => {
            utils.showToast(error.msg || error, 'error')
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

                    {/* 账号 */}
                    <Grid item>

                        <Grid container spacing={2} justify="center" alignItems="flex-end">
                            <Grid item xs={2}>
                                <AccountBoxIcon />
                            </Grid>
                            <Grid item xs={9}>
                                <TextField id="account" label={`用户名`} value={userName} onChange={typeUserName} />
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
                                <Button className={classes.width100} onClick={forgetPwd}>{`忘记密码`}</Button>
                            </Grid>
                        </Grid>
                    </Grid>

                    {/* 登录按钮 */}
                    <Grid item>
                        <Button className={classes.width100} variant="contained" color="primary" onClick={login} >
                            {`登录`}
                        </Button>
                    </Grid>

                </Grid>

            </Container>

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
