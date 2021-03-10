import React, { useState, useEffect } from 'react';
import utils from '../../utils';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

export default function GlobalDialog(props) {

    const [showDialog, setShowDialog] = useState(false)
    const [dialogTitle, setDialogTitle] = useState(`提示`)
    const [dialogContent, setDialogContent] = useState('')
    const [dialogCallBack, setDialogCallBack] = useState(null)
    const [dialogType, setDialogType] = useState('normal')  // type: normal confirm

    useEffect(() => {

        utils.showDialog = (title, content, type = 'normal', callBack = null) => {
            setDialogTitle(title)
            setDialogContent(content)
            setDialogType(type)
            setDialogCallBack({ callBack })  // 注意此处较为关键  回调函数在setState内部会自动调用
            setShowDialog(true)
        }

    }, [])

    const hideDialog = () => {
        setShowDialog(false)
    }

    const confirmDialog = () => {

        setShowDialog(false)
        if (dialogCallBack.callBack) {
            dialogCallBack.callBack({ type: 'confirm' })
        }

    }

    const cancelDialog = () => {
        setShowDialog(false)
        if (dialogCallBack.callBack) {
            dialogCallBack.callBack({ type: 'cancel' })
        }
    }

    return (
        <Dialog
            open={showDialog}
            onClose={hideDialog}
            disableBackdropClick
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{dialogTitle}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">{dialogContent}</DialogContentText>
            </DialogContent>
            <DialogActions>
                {/* 取消按钮仅在dialogType为confirm时出现 */}
                {
                    dialogType === 'confirm' && <Button onClick={cancelDialog} color="primary">{`${'取消'}`}</Button>
                }
                <Button onClick={confirmDialog} color="primary" autoFocus> {`${'确定'}`}</Button>
            </DialogActions>
        </Dialog>
    )

}