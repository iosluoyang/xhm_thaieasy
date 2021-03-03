import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Box, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import NavBar from "../../components/layout/navbar";



function HandleProduct(props) {

    const params = useParams()
    console.log(params)
    
    const useStyles = makeStyles((theme) => ({
        root: {
            
        }
    }))

    const classes = useStyles()

    return (
        <Box className={classes.root}>

            {/* 导航栏 */}
            <NavBar navtitle={`${'添加商品'}`}></NavBar>

        
        </Box>
    )

}
const mapStateToProps = (state, ownprops) => {
    return {...ownprops, ...state}
}
export default connect(mapStateToProps, null)(HandleProduct)