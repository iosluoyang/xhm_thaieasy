import React from 'react'
import { makeStyles } from '@material-ui/core/styles'


function Me(props) {
    const useStyles = makeStyles({
        me: {
            backgroundColor: 'green',
            height: '50px',
            fontSize: '20px'
        }
    })

    return (
        <div className="me">
            { 'I am Me'}
        </div>
    )
}

export default Me