import React, { useState, useRef, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import store from '@/store';
import { useHistory, useParams } from 'react-router-dom';
import { Box, AppBar, Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, Fab, Container } from '@material-ui/core';
import { VariableSizeList as ReactWindowList } from 'react-window';
import AutoSizer from "react-virtualized-auto-sizer";
import { makeStyles } from '@material-ui/core/styles';
import utils from '@/utils';
import { Add } from '@material-ui/icons';
import NavBar from "@/components/layout/navbar";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/effect-cube/effect-cube.scss';
import { getproductlistapi } from '@/api/productapi';

function ProductList(props) {

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

    let searchText = '' // 搜索文本
    // 开始搜索
    const startToSearch = (searchContent) => {
        searchText = searchContent
        console.log(`搜索前的索引为${initTabIndex}`)
        // 此处搜索的时候取值索引会为初始值  ...
        // 加载商品列表数据
        loadData(true)
    }

    let initPageInfo = {
        pageNum: 1,
        pageSize: 10,
        date: ''
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
            type: 0,
            loaded: false,
            pageInfo: initPageInfo
        },
        {
            title: `${'未添加任务'}`,
            type: 1,
            loaded: false,
            pageInfo: initPageInfo
        }
    ]

    // 列表的数据源数组
    let initDataTabs = navTabs.map(() => ([]))
    const [dataTabs, setDataTabs] = useState(initDataTabs)

    let initTabIndex = 0
    const [currentTabIndex, setCurrentTabIndex] = useState(initTabIndex)
    const handleChangeTab = (event, index) => {
        setCurrentTabIndex(index)
        initTabIndex = index
        if (ref.current && ref.current.swiper) ref.current.swiper.slideTo(index, 300)
        loadData()
    }
    const handleChangeSwiper = (swiper) => {
        let index = swiper.realIndex
        setCurrentTabIndex(index)
        initTabIndex = index
        loadData()
    }

    let listType = 'normallist' // 当前列表项的渲染类型  normallist 为正常渲染  reactwindowlist 为react-window虚拟列表渲染模式

    // 加载当前数据
    const loadData = (refresh) => {

        // 获取商品列表数据

        // 获取当前tab对象
        let currentTab = navTabs[initTabIndex]
        let jobFlag = currentTab.type
        let loaded = currentTab.loaded
        let pageInfo = currentTab.pageInfo

        // 如果为刷新状态则重置pageInfo为初始状态
        if (refresh) {
            loaded = false
            pageInfo = initPageInfo
        }

        // 如果没有加载过则进行加载
        if (!loaded) {
            console.log(`此时加载数据前的index为:${initTabIndex}`)
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

                // 变更state数据
                setDataTabs((oldDataTabs) => {
                    let tempDataTabs = [...oldDataTabs]
                    let tempDataList = tempDataTabs[initTabIndex]
                    tempDataList = data.pageNum === 1 ? list : tempDataList.concat(list)
                    tempDataTabs.splice(initTabIndex, 1, tempDataList)
                    return tempDataTabs
                })

                // console.log(`变更后的dataTabs数据为(未同步更新)`)
                // console.log(dataTabs)

                // 变更pageInfo和loaded数据
                currentTab.loaded = true
                let newDate = data.pageNum === 1 ? date : pageInfo.date
                let newPageNum = pageInfo.pageNum + 1
                pageInfo = { ...pageInfo, ...{ date: newDate }, ...{ pageNum: newPageNum } }
                currentTab.pageInfo = pageInfo
                console.log(`变更后的navTabs数据为(同步更新)`)
                console.log(navTabs)

            }).catch(error => {
                utils.showToast(error.msg, 'error')
            })

        }

    }

    useEffect(() => {

        // 获取商品列表数据
        loadData()

    }, [])

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
                        navTabs.map((eachitem, index) => {
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
                onSlideChange={handleChangeSwiper}
            >

                {
                    dataTabs.map((dataList, index) => {
                        return (
                            <SwiperSlide key={index} className='eachslide'>
                                {/* <Box textAlign='center'>{JSON.stringify(eachitem)}</Box> */}
                                {
                                    listType === 'normallist' &&
                                    <List className={classes.proList}>
                                        {
                                            dataList && dataList.length > 0 &&
                                            dataList.map((eachitem) => {
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