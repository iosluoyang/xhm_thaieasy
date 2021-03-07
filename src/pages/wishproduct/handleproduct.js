import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { Box, TextField, InputAdornment, Select, MenuItem, ListItemIcon, ListItemText, Avatar, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import NavBar from "../../components/layout/navbar";

import Icon1688Logo from '../../assets/icon/ic_1688logo.png';
import IconTbLogo from '../../assets/icon/ic_tblogo.png';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import FileCopyIcon from '@material-ui/icons/FileCopy';

function HandleProduct(props) {

    const params = useParams()
    console.log(params)
    let owntype = params.type || 'add'
    // 页面类型 type: add为新增  edit为编辑 copy为拷贝
    const [type, setType] = useState(owntype)

    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(2),

            '& .contentview': {

                '& .eachcontent': {
                    marginTop: theme.spacing(2)
                }

            }
        },
        frontIcon: {
            width: theme.spacing(3),
            height: theme.spacing(3)
        },
        endButton: {
            height: theme.spacing(4)
        }
    }))

    const classes = useStyles()

    const [proName, setProName] = useState('') // 商品名称
    const [linkType, setLinkType] = useState(0) // 链接来源  0淘宝 1 1688  默认为淘宝 99其他
    const [link, setLink] = useState('') // 来源链接
    const [remark, setRemark] = useState('') // 商品备注

    return (
        <Box className={classes.root}>

            {/* 导航栏 */}
            <NavBar navtitle={`${type === 'add' ? '添加商品' : type === 'edit' ? '编辑商品' : type === 'copy' ? '拷贝商品' : ''}`}></NavBar>

            {/* 输入内容区域 */}
            {
                <form className='contentview'>

                    {/* 商品名称 */}
                    <div className='protitle eachcontent'>
                        <TextField label={`${'商品名称'}`} value={proName} onChange={(e) => { setProName(e.target.value) }}></TextField>
                    </div>

                    {/* 链接类型 和链接地址 */}
                    <div className='linktype eachcontent'>

                        <TextField label={`${'商品链接'}`} value={link} onChange={(e) => { setLink(e.target.value) }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>

                                        <Select
                                            value={linkType}
                                            renderValue={(value) => {
                                                return (
                                                    value === 0 ? <Avatar className={classes.frontIcon} src={IconTbLogo} /> :
                                                        value === 1 ? <Avatar className={classes.frontIcon} src={Icon1688Logo} /> :
                                                            <InsertLinkIcon className={classes.frontIcon} />

                                                )
                                            }}
                                            onChange={(e) => { setLinkType(e.target.value) }}
                                        >
                                            <MenuItem value={0}>
                                                <ListItemIcon>
                                                    <Avatar className={classes.frontIcon} src={IconTbLogo} />
                                                </ListItemIcon>
                                                <ListItemText>{`${'淘宝'}`}</ListItemText>
                                            </MenuItem>
                                            <MenuItem value={1}>
                                                <ListItemIcon>
                                                    <Avatar className={classes.frontIcon} src={Icon1688Logo} />
                                                </ListItemIcon>
                                                <ListItemText>{`${'1688'}`}</ListItemText>
                                            </MenuItem>
                                            <MenuItem value={99}>
                                                <ListItemIcon>
                                                    <InsertLinkIcon className={classes.frontIcon} />
                                                </ListItemIcon>
                                                <ListItemText>{`${'其他'}`}</ListItemText>
                                            </MenuItem>
                                        </Select>

                                    </InputAdornment>
                                ),
                                // endAdornment: (

                                //     <InputAdornment position='end'>
                                //         <Button className={classes.endButton} variant='contained' size='small' color='primary' onClick={() => { setLink('xxx') }} startIcon={<FileCopyIcon />}>{`${'粘贴'}`}</Button>
                                //     </InputAdornment>

                                // )
                            }}
                        ></TextField>

                    </div>

                    {/* 商品图片 */}


                    {/* 商品备注 */}
                    <div className='remark eachcontent'>
                        <TextField label={`${'备注'}`} value={remark} multiline variant='outlined' rows={3} onChange={(e) => { setRemark(e.target.value) }}></TextField>
                    </div>
                </form>
            }

        </Box>
    )

}
const mapStateToProps = (storeState, ownProps) => {
    return { ...ownProps, ...storeState }
}
export default connect(mapStateToProps, null)(HandleProduct)