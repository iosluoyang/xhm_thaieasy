import React, { useState, useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import store from '@/store';
import { Box, TextField, InputAdornment, Select, MenuItem, ListItemIcon, ListItemText, Avatar, Button, Typography, CircularProgress, } from '@material-ui/core';
import { ImagePicker } from 'antd-mobile';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import NavBar from "@/components/layout/navbar";

import Icon1688Logo from '@/assets/icon/ic_1688logo.png';
import IconTbLogo from '@/assets/icon/ic_tblogo.png';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import { FileCopy, Send } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import utils from '@/utils';
import { addproductapi, getproductdetailapi, editproductapi } from '@/api/productapi'

// 自定义上传图片的hook
// ...
function useUploadImgs(imgArr) {
    // 根据是否有图片进行提交图片操作
    // ...
    // 有图片存在 遍历图片进行
    if (imgArr) {

        // 取出需要上传的图片
        let recordIndexArr = []
        let recordValueArr = []
        imgArr.forEach((eachimg, index) => {
            // 需要上传
            if (eachimg instanceof Object && eachimg.file) {
                recordIndexArr.push(index)
                recordValueArr.push(eachimg)
            }
        })

        let imgUrl = store.getState().appConfig.imgUrl

        // 开始同步上传图片
        utils.uploadImgsAsync(recordValueArr).then(imgurlArr => {

            // 替换之前的图片数组
            let oldimgs = [...imgArr]
            imgurlArr.forEach((eachitem, index) => {
                // 之前替换的索引
                let replaceIndex = recordIndexArr[index]
                // 要替换的值  替换为key为url值为实际地址的对象
                let replaceValue = { url: eachitem }
                // 进行替换
                oldimgs.splice(replaceIndex, 1, replaceValue)
            })

            // 汇集上送图片字符串
            let tempimgs = oldimgs.map(eachitem => (eachitem.url.indexOf(imgUrl) > -1 ? eachitem.url.replace(imgUrl, '') : eachitem.url)).join(',')
            console.log(`当前所有图片的字符串拼接为${tempimgs}`)
            let uploadImgs = tempimgs
            let newimgs = oldimgs.map(eachitem => {
                eachitem = eachitem.file || eachitem.url.indexOf(imgUrl) > -1 ? eachitem : { url: imgUrl + eachitem.url }
                return eachitem
            })

            return { newimgs: newimgs, imgStr: uploadImgs }

        }).catch(error => {
            utils.showToast(`${error.msg}`, 'error')
            return { newimgs: [], imgStr: '' }
        })
    }
    else {
        return { newimgs: [], imgStr: '' }
    }

}

function HandleProduct(props) {

    const location = useLocation()

    const params = useParams()
    let owntype = params.type || 'add'
    const history = useHistory()

    const search = location.search
    let searchDict = utils.queryString.parse(search)

    // 页面类型 type: add为新增  edit为编辑 copy为拷贝
    const [type, setType] = useState(owntype)

    const theme = useTheme()
    const useStyles = makeStyles((theme) => ({
        root: {
            paddingTop: '80px',
            boxSizing: 'border-box',
            backgroundColor: '#FFF',

            '& .contentview': {

                '& .eachcontent': {
                    width: '100%',
                    marginTop: theme.spacing(2),
                    '& .MuiTextField-root': {
                        width: '100%'
                    }
                }

            }
        },
        frontIcon: {
            width: theme.spacing(3),
            height: theme.spacing(3)
        },
        endButton: {
            height: theme.spacing(4)
        },
        submitView: {
            '& .submitBtn': {
                width: '100%'
            },
            '& .submitProgress': {
                color: green[500],
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: -12,
                marginLeft: -12,
            }
        }
    }))

    const classes = useStyles()

    const [proName, setProName] = useState('') // 商品名称
    const [proNameError, setProNameError] = useState(false) // 商品名称错误是否
    const onChangeProName = (e) => {
        setProName(e.target.value)
        setProNameError(e.target.value === '')
    } // 商品名称的输入过程

    const [linkType, setLinkType] = useState(0) // 链接来源  0淘宝 1 1688  默认为淘宝 99其他
    const [link, setLink] = useState('') // 来源链接
    const [linkError, setLinkError] = useState(false) // 商品来源链接错误是否
    const onChangeLink = (e) => {
        const content = e.target.value
        setLink(content)
        setLinkError(content === '')
        // 如果链接中包含tabbao字样则认为是淘宝链接 1688为1688链接  否则识别为其他链接
        if (content.indexOf('taobao') > -1) {
            setLinkType(0)
        }
        else if (content.indexOf('1688') > -1) {
            setLinkType(1)
        }
        else {
            setLinkType(99)
        }
    } // 商品链接的输入过程

    const [remark, setRemark] = useState('') // 商品备注
    const [remarkError, setRemarkError] = useState(false) // 商品备注错误是否
    const onChangeRemark = (e) => {
        setRemark(e.target.value)
        setRemarkError(e.target.value === '')
    } // 备注的输入过程

    const [imgs, setImgs] = useState([]) // 商品图片数组  固定为[{url: xxx}]的形式
    let uploadImgs = '' // 上传后台的图片字符串
    const [loading, setLoading] = useState(false) // 是否正在加载
    const onImgChange = (files, type, index) => {
        console.log(files, type, index);
        setImgs(files)
    }
    const onImgClick = (index, files) => {
        console.log(index, files)
    }

    const submitData = () => {
        if (!loading) {

            setLoading(true)

            // 根据是否有图片进行提交图片操作
            // ...
            // 有图片存在 遍历图片进行
            if (imgs) {

                // 取出需要上传的图片
                let recordIndexArr = []
                let recordValueArr = []
                imgs.forEach((eachimg, index) => {
                    // 需要上传
                    if (eachimg instanceof Object && eachimg.file) {
                        recordIndexArr.push(index)
                        recordValueArr.push(eachimg)
                    }
                })
                utils.uploadImgsAsync(recordValueArr).then(imgsArr => {

                    // 替换之前的图片数组
                    let oldimgs = [...imgs]
                    imgsArr.forEach((eachitem, index) => {
                        // 之前替换的索引
                        let replaceIndex = recordIndexArr[index]
                        // 要替换的值  替换为key为url值为实际地址的对象
                        let replaceValue = { url: eachitem }
                        // 进行替换
                        oldimgs.splice(replaceIndex, 1, replaceValue)
                    })

                    // 汇集上送图片字符串
                    let tempimgs = oldimgs.map(eachitem => (eachitem.url.indexOf(props.appConfig.imgUrl) > -1 ? eachitem.url.replace(props.appConfig.imgUrl, '') : eachitem.url)).join(',')
                    console.log(`当前所有图片的字符串拼接为${tempimgs}`)
                    uploadImgs = tempimgs
                    let newimgs = oldimgs.map(eachitem => {
                        eachitem = eachitem.file || eachitem.url.indexOf(props.appConfig.imgUrl) > -1 ? eachitem : { url: props.appConfig.imgUrl + eachitem.url }
                        return eachitem
                    })
                    console.log(newimgs)
                    setImgs(newimgs)

                    setLoading(false)

                    // 开始最终提交
                    finalSubmit()

                }).catch(error => {
                    setLoading(false)
                    utils.showToast(`${error.msg}`, 'error')
                })
            }

        }
    }

    // 最终提交数据
    const finalSubmit = () => {
        // 数据校验:

        // 商品名称
        if (!proName) {
            setProNameError(true)
            setLoading(false)
            return
        }
        else {
            setProNameError(false)
        }

        // 商品链接
        if (!link) {
            setLinkError(true)
            setLoading(false)
            return
        }
        else {
            setLinkError(false)
        }

        // 商品备注
        if (!remark) {
            setRemarkError(true)
            setLoading(false)
            return
        }
        else {
            setRemarkError(false)
        }


        // 开始提交数据
        let data = {
            title: proName,
            link: link,
            linkType: linkType,
            remark: remark,
            imgs: uploadImgs,
            jobId: ''
        }

        // 根据新增还是编辑进行不同接口的调用
        if (type === 'add' || type === 'copy') {

            console.log(data)

            addproductapi(data).then(response => {
                setLoading(false)
                history.replace('/wishproduct/productlist')
                utils.showToast(`${'提交成功'}`, 'success')

            }).catch(error => {
                setLoading(false)
                utils.showToast(`${'提交失败:'}${JSON.stringify(error.msg || error)}`, 'error')
            })
        }
        else if (type === 'edit') {
            data['pid'] = searchDict.pid
            console.log(data)

            editproductapi(data).then(response => {
                // 编辑成功
                setLoading(false)
                history.goBack()
                utils.showToast(`${'编辑成功'}`, 'success')
            }).catch(error => {
                setLoading(false)
                utils.showToast(`${'编辑失败:'}${JSON.stringify(error.msg || error)}`, 'error')
            })
        }

        else {
            utils.showToast(`${'错误的页面类型'}`, 'error')
        }


    }

    useEffect(() => {

        // 如果是编辑或者拷贝状态的话则请求商品详情数据
        if (owntype === 'edit' || owntype === 'copy') {
            getproductdetailapi({ pid: searchDict.pid }).then(response => {
                // 获取详情数据成功
                let productInfo = response.data
                setProName(productInfo.title)
                setLinkType(parseInt(productInfo.linkType))
                setLink(productInfo.link)
                setRemark(productInfo.remark)
                setImgs(() => {
                    let imgs = productInfo.imgs.split(',')
                    let newimgs = []
                    imgs.forEach(eachitem => {
                        newimgs.push({
                            url: props.appConfig.imgUrl + eachitem
                        })
                    })

                    return newimgs

                })

            }).catch(error => {
                // 获取详情数据失败
                utils.showToast(error.msg, 'error')
            })
        }

    }, [])

    return (
        <Box className={classes.root}>

            {/* 导航栏 */}
            <NavBar navtitle={`${type === 'add' ? '添加商品' : type === 'edit' ? '编辑商品' : type === 'copy' ? '拷贝商品' : ''}`}></NavBar>

            {/* 输入内容区域 */}
            {
                <Box className='contentview' paddingX={3}>

                    {/* 商品名称 */}
                    <div className='protitle eachcontent'>
                        <TextField label={`${'商品名称'}`} value={proName} error={proNameError} multiline rowsMax={3} onChange={onChangeProName}></TextField>
                    </div>

                    {/* 链接类型 和链接地址 */}
                    <div className='linktype eachcontent'>

                        <TextField label={`${'商品链接'}`} value={link} error={linkError} onChange={onChangeLink} multiline
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
                                //         <Button className={classes.endButton} variant='contained' size='small' color='primary' onClick={() => { setLink('xxx') }} startIcon={<FileCopy />}>{`${'粘贴'}`}</Button>
                                //     </InputAdornment>

                                // )
                            }}
                        ></TextField>

                    </div>

                    {/* 商品图片 */}
                    <div className='proimg eachcontent'>

                        <Typography variant='subtitle2'>{`${'上传图片'}`}</Typography>
                        <ImagePicker
                            files={imgs}
                            length={4}
                            disableDelete={false}
                            onChange={onImgChange}
                            onImageClick={onImgClick}
                            selectable={imgs.length < 9}
                            multiple={true}
                        />
                    </div>


                    {/* 商品备注 */}
                    <div className='remark eachcontent'>
                        <TextField label={`${'备注'}`} variant='outlined' value={remark} error={remarkError} multiline rows={3} onChange={onChangeRemark}></TextField>
                    </div>

                    {/* 提交按钮 */}
                    <Box className={classes.submitView} padding={3} display='flex' justifyContent='center' position='relative'>
                        <Button className='submitBtn'
                            variant='contained'
                            color='primary'
                            disabled={loading}
                            endIcon={<Send />}
                            onClick={submitData}
                        >
                            {`${'提交'}`}
                        </Button>
                        {loading && <CircularProgress size={24} className='submitProgress'></CircularProgress>}
                    </Box>

                </Box>
            }

        </Box>
    )

}
const mapStateToProps = (storeState, ownProps) => {
    return { ...ownProps, ...storeState }
}
export default connect(mapStateToProps, null)(HandleProduct)