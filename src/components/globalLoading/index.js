import React, { useState, useEffect } from 'react';
import utils from '@/utils';
import { Box, Backdrop, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

export default function GlobalLoading(props) {

    const useStyles = makeStyles((theme) => ({
        backdrop: {
            zIndex: theme.zIndex.drawer + 1,
            color: '#fff',
        }
    }))
    const classes = useStyles()

    const [loading, setLoading] = useState(false)

    useEffect(() => {

        utils.showLoading = (ifshowloading = false) => {
            setLoading(ifshowloading)
        }

    }, [])

    return (
        <Box>
            <Backdrop className={classes.backdrop} open={loading} onClick={() => { setLoading(false) }}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    )

}