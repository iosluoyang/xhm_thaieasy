import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'


export default function Mission() {

    const useStyles = makeStyles({
        root: {
            minHeight: '100%',
            paddingTop: '60px',
            paddingBottom: '56px',
            boxSizing: 'border-box'
        }
    });

    const classes = useStyles();

    return (
        <Box className={classes.root} bgcolor='warning.main'>
            <Typography variant='caption' color='textPrimary'>{`${'任务清单'}`}</Typography>
        </Box>
    )
}