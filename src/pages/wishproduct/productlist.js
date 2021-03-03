import React from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Box, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import NavBar from "../../components/layout/navbar";


function WishProduct(props) {

    const history = useHistory()

    const useStyles = makeStyles((theme) => ({
        root: {

        }
    }))

    const classes = useStyles()

    return (
        <Box className={classes.root}>

            {/* 导航栏 */}
            <NavBar navtitle={ `${'商品池'}` } isSearch></NavBar>

            {/* Tab栏 */}

            {/* 商品列表 */}
            

        </Box>
    )
}

const mapStateToProps = ((state) => {
    return state
})

export default connect(mapStateToProps, null)(WishProduct)