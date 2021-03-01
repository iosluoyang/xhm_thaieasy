import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Box, Card, CardActions, CardContent, Button, Typography } from '@material-ui/core'
import { gethomepagedata } from '../../api/homeapi';
import SwiperCore, { Pagination, Autoplay, EffectCube } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper.scss';
import 'swiper/components/pagination/pagination.scss';
import 'swiper/components/effect-cube/effect-cube.scss';


SwiperCore.use([Pagination, Autoplay, EffectCube]);

// 轮播图组件
function SwiperCom(props) {

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
            effect='cube'
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
function NoticeList() {

    const useStyles = makeStyles({
        root: {
            width: '80%'
        },
        bullet: {
            display: 'inline-block',
            margin: '0 2px',
            transform: 'scale(0.8)',
        },
        title: {
            fontSize: 14,
        },
        pos: {
            marginBottom: 12,
        },
    });

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Word of the Day
                </Typography>
                <Typography variant="h5" component="h2">
                    be{bull}nev{bull}o{bull}lent
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                    adjective
                </Typography>
                <Typography variant="body2" component="p">
                    well meaning and kindly.
                    <br />
                    {'"a benevolent smile"'}
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small">查看详情</Button>
            </CardActions>
        </Card>
    );

}

// 主页组件
function Home(props) {

    const useStyles = makeStyles({
        carousel: {

        }
    })
    const classes = useStyles()

    const [state, setState] = useState({
        carouselArr: [],
        noticeList: []
    })

    useEffect(
        () => {
            console.log(`更新了数据  开始获取接口内容`)
            // 获取首页的数据
            gethomepagedata().then(response => {
                // 获取首页数据成功
                setState({
                    carouselArr: response.data.carouselList,
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

        <Box className='home'>

            {/* 轮播图 */}
            {
                (state.carouselArr && state.carouselArr.length > 0) && <SwiperCom carouselArr={state.carouselArr} carouselHeight={300} {...props}></SwiperCom>
            }

            {/* 如何使用 */}

            {/* 公告列表 */}
            {
                (state.noticeList && state.noticeList.length > 0) && <NoticeList noticeList={state.noticeList} {...props}></NoticeList>
            }

        </Box>

    )

}

const mapStateToProps = ((state, ownprops) => {
    return { ...ownprops, ...state }
})

export default connect(mapStateToProps, null)(Home)