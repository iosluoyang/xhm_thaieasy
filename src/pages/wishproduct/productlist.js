import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Box, AppBar, Tabs, Tab, List, ListItem, ListItemAvatar, ListItemText, Fab, Container } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';

import NavBar from "../../components/layout/navbar";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/effect-cube/effect-cube.scss';


function WishProduct(props) {

    const history = useHistory()

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

    const startToSearch = (searchText) => {
        console.log(`开始搜索,搜索文本为${searchText}`)
    }

    let owntabs = [
        {
            title: `${'全部'}`,
            type: -1
        },
        {
            title: `${'任务中'}`,
            type: 0
        },
        {
            title: `${'未添加任务'}`,
            type: 1
        }
    ]

    const [tabs, setTabs] = useState(owntabs)
    const [currentTab, setCurrentTab] = useState(0)
    const handleChangeTab = (event, index) => {
        setCurrentTab(index)
        if (swiper) swiper.slideTo(index, 300)
    }

    const [swiper, setSwiper] = useState(null)

    const toAddPro = () => {
        history.push('/wishproduct/handleproduct/add')
    }

    return (
        <Box className={classes.root}>

            {/* 导航栏 */}
            <NavBar navtitle={`${'商品池'}`} isSearch onStartToSearch={startToSearch}></NavBar>

            {/* Tab栏 */}
            <AppBar position='sticky' className={classes.filterPanel} color='default'>

                <Tabs value={currentTab} onChange={handleChangeTab} indicatorColor='primary' variant='fullWidth'>

                    {
                        tabs.map((eachitem, index) => {
                            return (
                                <Tab label={eachitem.title} key={index}></Tab>
                            )
                        })
                    }

                </Tabs>

            </AppBar>

            {/* 商品列表 */}
            <Swiper
                initialSlide={currentTab}
                autoplay={false}
                className={classes.swiper}
                spaceBetween={0}
                slidesPerView={1}
                onInit={(swiper) => { setSwiper(swiper) }}
                onSlideChange={(swiper) => { setCurrentTab(swiper.realIndex) }}
            >

                {
                    tabs.map((eachitem, index) => {
                        return (
                            <SwiperSlide key={eachitem.type} className='eachslide'>
                                <Box textAlign='center' marginTop={2}>{`我是第${index}个页面`}</Box>
                                <List className={classes.proList}>
                                    {
                                        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((eachitem, index) => {
                                            return (
                                                <ListItem className='eachpro' divider button key={index}>
                                                    <ListItemAvatar>
                                                        <img className='img' src={props.appConfig.imgUrl + 'cjsq_img/common/xhm_w220_h146_7b8184698e6f42d98b0d50b9a690d4ce.jpg'}></img>
                                                    </ListItemAvatar>
                                                    <ListItemText primary={`商品${index}`}>

                                                    </ListItemText>
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
                <AddIcon onClick={toAddPro} />
            </Fab>

        </Box>
    )
}

const mapStateToProps = ((state) => {
    return state
})

export default connect(mapStateToProps, null)(WishProduct)