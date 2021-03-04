import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Box, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavBar from "../../components/layout/navbar";

function HandleProduct(props) {

    const params = useParams()
    console.log(params)
    let owntype = params.type || 'add'
    // 页面类型 type: add为新增  edit为编辑 copy为拷贝
    const [type, setType] = useState(owntype)
    
    const useStyles = makeStyles((theme) => ({
        root: {
            
        }
    }))

    const classes = useStyles()

    return (
        <Box className={classes.root}>

            {/* 导航栏 */}
            <NavBar navtitle={`${ type === 'add' ? '添加商品' : type === 'edit' ? '编辑商品' : type === 'copy' ? '拷贝商品' : '' }`}></NavBar>

        
        </Box>
    )

}
const mapStateToProps = (state, ownprops) => {
    return {...ownprops, ...state}
}
export default connect(mapStateToProps, null)(HandleProduct)