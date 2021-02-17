import React from 'react'
import { makeStyles } from '@material-ui/core/styles'


export default function Content() {

    const useStyles = makeStyles({
        content: {
            marginTop: '80px',
            backgroundColor: '#ff3b30',
            width: '100%',
            height: '100px',
        }
    });

    const classes = useStyles();

    return (
        <div className={classes.content}>{'content'}</div>
    )
}