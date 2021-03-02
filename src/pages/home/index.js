import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Box, Grid, Card, CardHeader, CardMedia, CardContent, Typography, Button, withWidth, isWidthUp } from '@material-ui/core'
import { gethomepagedata } from '../../api/homeapi';
import SwiperCore, { Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/effect-cube/effect-cube.scss';


// 轮播图组件
function SwiperCom(props) {

    SwiperCore.use([Pagination, Autoplay]);

    const history = useHistory()

    const useStyles = makeStyles(theme => ({

        swiper: {
            height: props.carouselHeight,

            '& .eachslide': {

                width: '100%',
                height: '100%',

                '& .img': {
                    width: '100%',
                    height: '100%',
                    display: 'block',
                }
            },

        }
    }))
    const classes = useStyles()

    const clickSlide = (eachitem) => (event) => {
        console.log(`当前点击的类型为:${eachitem.type}`)
        let type = eachitem.type // 跳转类型 1跳转链接   2公告详情   3商品详情   -99代表无跳转
        let value = eachitem.value
        // 根据不同的类型跳转不同的页面
        switch (type) {
            // 跳转链接
            case 1:
                // location.href = value
                break;
            // 跳转公告
            case 2:
                history.push(`/noticeDetail?id=${value}`)
                break;
            // 商品详情
            case 3:
                history.push(`/productDetail?pid=${value}`)
                break;

            default:
                break;
        }
    }

    return (

        <Swiper
            autoplay={{ disableOnInteraction: false }}
            speed={500}
            loop
            className={classes.swiper}
            spaceBetween={50}
            slidesPerView={1}
            pagination={{ clickable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
        // onSlideChange={(swiper) => console.log(`当前loop模式下切换到的索引为:${swiper.activeIndex}`)}
        >

            {
                props.carouselArr.map((eachitem, index) => {
                    return (
                        <SwiperSlide key={index} className='eachslide' onClick={clickSlide(eachitem)}>
                            <img className='img' src={props.appConfig.imgUrl + eachitem.img}></img>
                        </SwiperSlide>
                    )
                })
            }

        </Swiper>

    )

}

// 通知列表
function NoticeList(props) {

    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(2)
        },
        eachnotice: {
            width: '100%',
            '& .header': {

            },
            '& .img': {
                height: 0,
                paddingTop: '56.25%'
            }
        }
       
    }));

    const classes = useStyles();

    return (
        <div className={classes.root}>

            <Typography variant="body1" color="textSecondary" component="p">{`${'公告'}`}</Typography>
            <Grid container justify='flex-start' alignItems='center' spacing={2}>
                {
                    props.noticeList.map((eachitem, index) => {
                        return (
                            <Grid item key={eachitem.id} xs={6}>
                                <Card>
                                    {/* 头部 */}
                                    <CardHeader className='header' title={eachitem.title} subheader={eachitem.createDate}></CardHeader>
                                    {/* 公告图片 */}
                                    { eachitem.img && <CardMedia className='img' img={props.appConfig.imgUrl + eachitem.img}></CardMedia> }
                                    {/* 公告内容 */}
                                    <CardContent>
                                        <Typography variant="body2" color="textSecondary" component="p">{eachitem.content}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    );

}

// 主页组件
function Home(props) {

    const useStyles = makeStyles((theme) => ({
        root: {
            // width: '100%'
            paddingBottom: '56px'
        }
    }))
    const classes = useStyles()

    const [state, setState] = useState({
        carouselList: [],
        noticeList: []
    })

    useEffect(
        () => {
            console.log(`更新了数据  开始获取接口内容`)
            // 获取首页的数据
            gethomepagedata().then(response => {
                // 获取首页数据成功
                setState({
                    carouselList: response.data.carouselList,
                    noticeList: response.data.listNotice
                })
            }).catch(error => {
                // 获取首页数据失败
                console.log(JSON.stringify(error))
            })
        },
        []
    )

    return (

        <Box className={classes.root} >

            {/* 轮播图 */}
            {
                (state.carouselList && state.carouselList.length > 0) && <SwiperCom carouselArr={state.carouselList} carouselHeight={ isWidthUp('sm', props.width) ? '400px' : '300px' } {...props}></SwiperCom>
            }

            {/* 公告列表 */}
            {
                (state.noticeList && state.noticeList.length > 0) && <NoticeList noticeList={state.noticeList} {...props}></NoticeList>
            }

            {/* 如何使用 */}

            <div>

            </div>

            

        </Box>

    )

}

const mapStateToProps = ((state, ownprops) => {
    return { ...ownprops, ...state }
})

export default connect(mapStateToProps, null)(withWidth()(Home))