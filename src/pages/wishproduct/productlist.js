import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import store from '@/store';
import { useHistory, useParams, useLocation } from 'react-router-dom';
import { Box, AppBar, Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, ListItemIcon, ListItemSecondaryAction, IconButton, Fab, Container } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { VariableSizeList as ReactWindowList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import { makeStyles } from '@material-ui/core/styles';
import utils from '@/utils';
import { Add, DeleteTwoTone, Edit } from '@material-ui/icons';
import NavBar from "@/components/layout/navbar";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/effect-cube/effect-cube.scss';
import { getproductlistapi, deleteproductapi } from '@/api/productapi';

// 单个商品元素
function EachProItem(props) {

    let eachitem = props.dataItem
    let imgUrl = props.appConfig.imgUrl
    let index = props.index

    // 删除商品
    const deletePro = () => {
        utils.showDialog(`${'确认'}`, `${'确认删除该商品吗?'}`, 'confirm', (callBack) => {
            if (callBack.type === 'confirm') {
                // 开始删除商品
                let pid = eachitem.pid

                // 请求接口
                deleteproductapi({ pid }).then(response => {
                    // 删除成功

                    // 通知父组件删除对应商品
                    let data = {
                        type: 'delete',
                        proInfo: { ...eachitem, ...{ index: index } }
                    }
                    props.onUpdateProItem(data)

                    utils.showToast(`${'删除成功'}`)
                }).catch(error => {
                    utils.showToast(error.msg, 'error')
                })

            }
        })
    }

    // 编辑商品
    const editPro = () => {
        let pid = eachitem.pid
        props.history.push(`/wishproduct/handleproduct/edit?pid=${pid}`)
    }

    return (
        <Box>
            <ListItem className='eachpro' divider button key={eachitem.pid}>

                {/* 商品图片 */}
                {
                    eachitem.imgs && eachitem.imgs.split(',').length > 0 &&
                    <ListItemAvatar>
                        <img className='img' alt={eachitem.title} src={imgUrl + eachitem.imgs.split(',')[0]}></img>
                    </ListItemAvatar>
                }

                {/* 商品标题和备注 */}
                <ListItemText primary={eachitem.title} secondary={eachitem.remark}>

                </ListItemText>

                {/* 操作按钮 */}
                {
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete" onClick={deletePro}>
                            {/* 删除 */}
                            <DeleteTwoTone fontSize='small' color='secondary' />
                        </IconButton>
                        <IconButton edge="end" aria-label="edit" onClick={editPro}>
                            {/* 编辑 */}
                            <Edit fontSize='small' />
                        </IconButton>
                    </ListItemSecondaryAction>
                }

            </ListItem>
        </Box>
    )
}

function ProductList(props) {

    const history = useHistory()
    const swiperRef = useRef(null)

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
        },
        loadmoreText: {
            color: 'blue',
        }
    }))

    const classes = useStyles()

    const searchTextRef = useRef('')  // 搜索文本
    // 开始搜索
    const startToSearch = (searchContent) => {
        searchTextRef.current = searchContent
        // 加载商品列表数据
        loadData(true)
    }

    let initPageInfo = {
        pageNum: 1,
        pageSize: 10,
        date: '',
        loadAll: false
    }
    // nav的数组  记录当前页码 是否加载等信息
    let navTabs = [
        {
            title: `${'全部'}`,
            type: -1,
            loaded: false,
            pageInfo: initPageInfo
        },
        {
            title: `${'任务中'}`,
            type: 1,
            loaded: false,
            pageInfo: initPageInfo
        },
        {
            title: `${'未添加任务'}`,
            type: 0,
            loaded: false,
            pageInfo: initPageInfo
        }
    ]
    const navTabsRef = useRef(navTabs)

    // 列表的数据源数组
    let initDataTabs = navTabsRef.current.map(() => ([]))
    const [dataTabs, setDataTabs] = useState(initDataTabs)

    // 当前tab的索引
    const [currentTabIndex, setCurrentTabIndex] = useState(0)
    const handleChangeTab = (event, index) => {
        setCurrentTabIndex(index)
        if (swiperRef.current) swiperRef.current.slideTo(index, 300)
    }
    const handleChangeSwiper = (swiper) => {
        let index = swiper.realIndex
        setCurrentTabIndex(index)
    }

    // 更改了currentTabIndex后进行数据请求
    useEffect(() => {

        let navTabs = navTabsRef.current
        let currentTab = navTabs[currentTabIndex]
        let loaded = currentTab.loaded
        console.log(`切换了index索引  当前最新的索引为${currentTabIndex}  是否加载过:${loaded}`)
        // 没有加载过数据则进行接口请求
        if (!loaded) {
            loadData()
        }

    }, [currentTabIndex])


    let listType = 'normallist' // 当前列表项的渲染类型  normallist 为正常渲染  reactwindowlist 为react-window虚拟列表渲染模式

    const [loading, setLoading] = useState(false)
    // 加载当前数据
    const loadData = (refresh) => {

        // 获取商品列表数据

        // 获取当前tab对象
        let navTabs = navTabsRef.current
        let currentTab = navTabs[currentTabIndex]
        let jobFlag = currentTab.type
        let pageInfo = currentTab.pageInfo

        // 如果为刷新状态则重置pageInfo为初始状态
        if (refresh) {
            pageInfo = initPageInfo
        }

        let data = {
            ...{ title: searchTextRef.current },
            ...{ account: '' }, // 某个客服的特定商品
            ...{ email: '' }, // 某个用户的特定商品
            ...{ jobFlag: jobFlag },
            ...pageInfo,
        }

        console.log(`上送的参数为:${JSON.stringify(data)}`)

        setLoading(true)

        getproductlistapi(data).then(response => {
            // 获取列表成功
            setLoading(false)
            let list = response.data.list || []
            let date = response.data.date

            // 变更state数据
            setDataTabs((oldDataTabs) => {
                let tempDataTabs = [...oldDataTabs]
                let tempDataList = tempDataTabs[currentTabIndex]
                tempDataList = data.pageNum === 1 ? list : tempDataList.concat(list)
                tempDataTabs.splice(currentTabIndex, 1, tempDataList)
                return tempDataTabs
            })

            // console.log(`变更后的dataTabs数据为(未同步更新)`)
            // console.log(dataTabs)

            // 变更pageInfo和loaded数据
            currentTab.loaded = true
            let newDate = data.pageNum === 1 ? date : pageInfo.date
            let newPageNum = pageInfo.pageNum + 1
            pageInfo = { ...pageInfo, ...{ date: newDate }, ...{ pageNum: newPageNum }, ...{ loadAll: list.length < pageInfo.pageSize } }
            currentTab.pageInfo = pageInfo
            navTabsRef.current = navTabs

            console.log(`变更后的navTabs数据为(同步更新)`)
            console.log(navTabsRef.current)

        }).catch(error => {
            setLoading(false)
            utils.showToast(error.msg, 'error')
        })

    }

    // 更新子元素
    const updateProItem = (data) => {
        console.log(`子组件传递的数据为${JSON.stringify(data)}`)
        let type = data.type
        switch (type) {

            // 删除商品
            case 'delete':
                {
                    let proInfo = data.proInfo
                    let index = proInfo.index
                    // 删除对应数据的数组
                    setDataTabs((oldDataTabs) => {
                        let tempDataTabs = [...oldDataTabs]
                        let currentDataTab = tempDataTabs[currentTabIndex]
                        currentDataTab.splice(index, 1)
                        return tempDataTabs
                    })
                }

                break;

            default:
                break;
        }
    }

    const toAddPro = () => {
        history.push('/wishproduct/handleproduct/add')
    }

    // 列表渲染方式为reactwindowlist时的子元素
    function ReactWindowEachItem(props) {

        // index：列表项的下标；style：列表项的样式（此参数必须传入列表项的组件中，否则会出现滚动到下方出现空白的情况）
        const { index, style, data } = props
        let eachitem = data[index]

        let imgUrl = store.getState().appConfig.imgUrl

        return (
            <ListItem className='eachpro' style={style} divider button key={eachitem.pid}>

                {/* 商品图片 */}
                {
                    eachitem.imgs && eachitem.imgs.split(',').length > 0 && imgUrl &&
                    <ListItemAvatar>
                        <img className='img' alt={eachitem.title} src={imgUrl + eachitem.imgs.split(',')[0]}></img>
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
    }

    return (
        <Box className={classes.root}>

            {/* 导航栏 */}
            <NavBar navtitle={`${'商品池'}`} isSearch onStartToSearch={startToSearch}></NavBar>

            {/* Tab栏 */}
            <AppBar position='sticky' className={classes.filterPanel} color='default'>

                <Tabs value={currentTabIndex} onChange={handleChangeTab} indicatorColor='primary' variant='fullWidth'>

                    {

                        navTabsRef.current.map((eachitem, index) => {
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
                onInit={(swiper) => { swiperRef.current = swiper }}
                onSlideChange={handleChangeSwiper}
            >

                {
                    dataTabs.map((dataList, index) => {
                        return (
                            <SwiperSlide key={index} className='eachslide'>
                                {
                                    listType === 'normallist' &&
                                    <List className={classes.proList}>
                                        {
                                            dataList && dataList.length > 0 &&
                                            dataList.map((eachitem, index) => <EachProItem key={eachitem.pid} {...props} dataItem={eachitem} index={index} onUpdateProItem={updateProItem}></EachProItem>)
                                        }

                                        {/* 加载更多或者全部加载 */}
                                        {
                                            <ListItem button dense onClick={navTabsRef.current[currentTabIndex].pageInfo.loadAll ? null : () => { loadData() }}>

                                                <ListItemIcon>
                                                    {
                                                        loading &&
                                                        <CircularProgress></CircularProgress>
                                                    }
                                                </ListItemIcon>
                                                <ListItemText inset className={classes.loadmoreText}>
                                                    {
                                                        navTabsRef.current[currentTabIndex].pageInfo.loadAll ? '已加载全部' : '加载更多'
                                                    }
                                                </ListItemText>

                                            </ListItem>
                                        }
                                    </List>
                                }
                                {
                                    listType === 'reactwindowlist' &&
                                    <AutoSizer>
                                        {({ height, width }) => (
                                            <ReactWindowList
                                                className={classes.proList}
                                                width={width}
                                                height={height}
                                                itemCount={dataList.length}
                                                itemData={dataList}
                                                estimatedItemSize={80}
                                                itemSize={(index) => (100)}
                                                itemKey={(index, data) => (data[index].pid)}
                                            >
                                                {
                                                    ReactWindowEachItem
                                                }
                                            </ReactWindowList>
                                        )}
                                    </AutoSizer>
                                }
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

export default connect(mapStateToProps, null)(ProductList)