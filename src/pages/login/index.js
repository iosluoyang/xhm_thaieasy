import React, { useState } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionLogin } from '../../store/actionCreator'

import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Container, Grid, TextField, Button, FormControl, InputAdornment, InputLabel, Input, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import md5 from 'js-md5';

function Login(props) {

    const useStyles = makeStyles(theme => ({

        root: {
            '& > *': {
                margin: theme.spacing(1),
                width: '25ch',
            },
        },
        margin: {
            margin: theme.spacing(1),
        },
        withoutLabel: {
            marginTop: theme.spacing(3),
        },
        textField: {
            width: '25ch',
        },

    }))
    const classes = useStyles()

    const history = useHistory()

    const [username, setUserName] = useState('')
    const [pwd, setPwd] = useState('')
    const [showpwd, setShowPwd] = useState(false)

    const handleClickShowPassword = () => {
        setShowPwd(!showpwd)
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const typeUserName = (event) => {
        setUserName(event.target.value)
    }
    const typePwd = (event) => {
        setPwd(event.target.value)
    }

    const login = () => {

        // 调用登录接口
        let data = {
            account: username,
            pwd: md5(pwd)
        }
        props.actionLogin(data).then(response => {
            console.log(`登录成功`)
            console.log(response.data)
            // 登录成功 跳转页面
            history.goBack()
        }).catch(error => {
            console.log(error.msg)
        })

    }

    return (

        <Container maxWidth='sm'>

            <h2>{props.appName}</h2>

            <Grid container spacing={2} direction='column' justify="center">

                {/* 账号 */}
                <Grid container spacing={1} justify="center" alignItems="center">
                      <Grid item>
                        <AccountBoxIcon />
                      </Grid>
                      <Grid item>
                        <TextField id="account" label="用户名" value={username} onChange={typeUserName} />
                      </Grid>
                </Grid>

                {/* 密码 */}
                <Grid spacing={1} justify="center" alignItems="center">
                      <Grid item>
                        <VpnKeyIcon />
                      </Grid>
                      <Grid item>

                        {/* 密码 */}
                        <FormControl className={clsx(classes.margin, classes.textField)}>
                            <InputLabel>Password</InputLabel>
                            <Input
                                type={showpwd ? 'text' : 'password'}
                                value={pwd}
                                onChange={typePwd}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                        >
                                            {showpwd ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        
                      </Grid>
                </Grid>


            </Grid>

            

            <form className={classes.root} autoComplete="on">

                {/* 账号 */}
                <TextField id="input-with-icon-grid" label="UserName" value={username} onChange={typeUserName} />

                {/* 密码 */}
                <FormControl className={clsx(classes.margin, classes.textField)}>
                    <InputLabel>Password</InputLabel>
                    <Input
                        type={showpwd ? 'text' : 'password'}
                        value={pwd}
                        onChange={typePwd}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {showpwd ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                <Button variant="contained" color="primary" onClick={login} >
                    登录
                </Button>
            </form>

        </Container>

    )

}

const mapStateToProps = (state, ownprops) => {
    console.log(state)
    return {
        appName: state.appConfig.appName
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ actionLogin }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
