import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Container, Grid, TextField, Button, FormControl, InputAdornment, InputLabel, Input, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import LockIcon from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

import { loginapi } from '../../api/userapi'
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
        console.log(`username: ${username}   pwd:${pwd}`)
        // 调用登录接口
        let data = {
            account: username,
            pwd: md5(pwd)
        }
        loginapi(data).then(response => {
            // 登录成功
            let logindata = response.data
            console.log(logindata)
        }).catch(error => {
            // 登录失败
        })
    }

    return (

        <Container maxWidth='sm'>

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

export default Login
