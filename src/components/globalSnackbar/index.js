import React, { useState, useEffect } from 'react';
import utils from '../../utils';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';

export default function GlobalSnackbar(props) {

    const [showToast, setShowToast] = useState(false)
    const [toastType, setToastType] = useState('info')
    const [toastMsg, setToastMsg] = useState('')

    const hideToast = () => {
        setShowToast(false)
    }

    useEffect(() => {

        utils.showToast = (msg, type = 'info') => {
            setToastMsg(msg)
            setToastType(type)
            setShowToast(true)
        }

    }, [])


    return (
        <Snackbar open={showToast} autoHideDuration={3000} onClose={hideToast} anchorOrigin={{ horizontal: 'center', vertical: 'bottom' }}>
            <Alert severity={toastType} variant='filled' onClose={hideToast} >{toastMsg}</Alert>
        </Snackbar>
    )

}
