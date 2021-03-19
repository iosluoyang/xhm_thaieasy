import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Box, AppBar, Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, Fab, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import utils from '@/utils';
import { Add } from '@material-ui/icons';
import NavBar from "@/components/layout/navbar";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/effect-cube/effect-cube.scss';
import { getproductlistapi } from '@/api/productapi';


// 自定义hook实现
const useSyncCallback = callback => {
    const [proxyState, setProxyState] = useState({ current: false })

    const Func = useCallback(() => {
        setProxyState({ current: true })
    }, [proxyState])

    useEffect(() => {
        if (proxyState.current === true) setProxyState({ current: false })
    }, [proxyState])

    useEffect(() => {
        proxyState.current && callback()
    })

    return Func
}

function WishProduct(props) {

    const history = useHistory()
    const ref = useRef({ swiper: null })

    const useStyles = makeStyles((theme) => ({
        root: {
            paddingTop: '60px',
        },
        filterPanel: {
            top: '56px'
        },
        swiper: {

            height: 'calc(100vh - 60px - 56px)',

            '& .eachslide': {

                width: '100%',
                height: '100%',
                overflow: 'auto'
            },

        },

        proList: {

            '& .eachpro': {

                '& .img': {
                    width: theme.spacing(10),
                    height: theme.spacing(10),
                    marginRight: theme.spacing(2),
                    objectFit: 'cover',
                    borderRadius: '5px'
                }

            }

        },

        fabBtn: {
            position: 'fixed',
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            zIndex: 100
        }
    }))

    const classes = useStyles()

    let searchText = ''
    const startToSearch = (searchContent) => {
        console.log(`开始搜索,搜索文本为${searchContent}`)
        searchText = searchContent
        // 加载商品列表数据
        loadData(true)
    }

    let initPageInfo = {
        pageNum: 1,
        pageSize: 10,
        date: ''
    }

    let owntabs = [
        {
            title: `${'全部'}`,
            type: -1,
            dataList: [],
            loaded: false,
            pageInfo: initPageInfo
        },
        {
            title: `${'任务中'}`,
            type: 0,
            dataList: [],
            loaded: false,
            pageInfo: initPageInfo
        },
        {
            title: `${'未添加任务'}`,
            type: 1,
            dataList: [],
            loaded: false,
            pageInfo: initPageInfo
        }
    ]

    const [tabs, setTabs] = useState(owntabs)
    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const handleChangeTab = (event, index) => {
        setCurrentTabIndex(index)
        if (ref.current && ref.current.swiper) ref.current.swiper.slideTo(index, 300)
        loadData()
    }

    // 加载当前数据
    const loadData = (refresh) => {

        // 获取商品列表数据
        // 获取当前tab对象
        let currentTab = { ...tabs[currentTabIndex] } // 深拷贝对象
        let jobFlag = currentTab.type
        let ifloaded = currentTab.loaded
        let pageInfo = currentTab.pageInfo

        // 如果没有加载过则进行加载
        if (!ifloaded || true) {

            // 如果为刷新状态则重置pageInfo为初始状态
            if (refresh) {
                pageInfo = initPageInfo
            }
            let data = {
                ...{ title: searchText },
                ...{ account: '' }, // 某个客服的特定商品
                ...{ email: '' }, // 某个用户的特定商品
                ...{ jobFlag: jobFlag },
                ...pageInfo,
            }

            console.log(`上送的参数为:${JSON.stringify(data)}`)

            getproductlistapi(data).then(response => {
                // 获取列表成功
                let list = response.data.list || []
                let date = response.data.date
                console.log(`获取到的数据为:`)
                console.log(response)

                setTabs((oldTabs) => {
                    let tempTabs = [...oldTabs]
                    let tempCurTab = tempTabs[currentTabIndex]
                    tempCurTab.dataList = refresh ? list : tempCurTab.dataList.concat(list)
                    tempCurTab.loaded = true
                    tempCurTab.pageInfo = {
                        pageNum: refresh ? initPageInfo.pageNum : tempCurTab.pageInfo.pageNum + 1,
                        pageSize: tempCurTab.pageInfo.pageSize,
                        date: refresh ? initPageInfo.date : tempCurTab.pageInfo.date
                    }
                    return tempTabs
                })

                console.log(`变更后的tabs数据为`)
                console.log(tabs)

            }).catch(error => {
                utils.showToast(error.msg, 'error')
            })

        }

    }

    useEffect(() => {

        // 获取商品列表数据
        loadData()

    }, [])

    // const [swiper, setSwiper] = useState(null)

    const toAddPro = () => {
        history.push('/wishproduct/handleproduct/add')
    }

    return (
        <Box className={classes.root}>

            {/* 导航栏 */}
            <NavBar navtitle={`${'商品池'}`} isSearch onStartToSearch={startToSearch}></NavBar>

            {/* Tab栏 */}
            <AppBar position='sticky' className={classes.filterPanel} color='default'>

                <Tabs value={currentTabIndex} onChange={handleChangeTab} indicatorColor='primary' variant='fullWidth'>

                    {
                        owntabs.map((eachitem, index) => {
                            return (
                                <Tab label={eachitem.title} key={index}></Tab>
                            )
                        })
                    }

                </Tabs>

            </AppBar>

            {/* 商品列表 */}
            <Swiper
                initialSlide={currentTabIndex}
                autoplay={false}
                className={classes.swiper}
                spaceBetween={0}
                slidesPerView={1}
                onInit={(swiper) => { ref.current.swiper = swiper }}
                onSlideChange={(swiper) => { setCurrentTabIndex(swiper.realIndex) }}
            >

                {
                    tabs.map((eachitem, index) => {
                        return (
                            <SwiperSlide key={eachitem.type} className='eachslide'>
                                {/* <Box textAlign='center'>{JSON.stringify(eachitem)}</Box> */}
                                <List className={classes.proList}>
                                    {
                                        eachitem.dataList && eachitem.dataList.length > 0 &&
                                        eachitem.dataList.map((eachitem) => {
                                            return (
                                                <ListItem className='eachpro' divider button key={eachitem.pid}>

                                                    {/* 商品图片 */}
                                                    {
                                                        eachitem.imgs && eachitem.imgs.split(',').length > 0 &&
                                                        <ListItemAvatar>
                                                            <img className='img' alt={eachitem.title} src={props.appConfig.imgUrl + eachitem.imgs.split(',')[0]}></img>
                                                        </ListItemAvatar>
                                                    }

                                                    {/* 商品标题和备注 */}
                                                    <ListItemText primary={eachitem.title} secondary={eachitem.remark}>

                                                    </ListItemText>

                                                    {/* 操作按钮 */}
                                                    {

                                                    }

                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </SwiperSlide>
                        )
                    })
                }

            </Swiper>

            {/* 浮动按钮 */}
            <Fab className={classes.fabBtn} color="primary" aria-label="add">
                <Add onClick={toAddPro} />
            </Fab>

        </Box>
    )
}

const mapStateToProps = ((state) => {
    return state
})

export default connect(mapStateToProps, null)(WishProduct)