import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Box, Grid, Card, CardActionArea, CardMedia, CardContent, Typography, GridList, GridListTile, GridListTileBar, Stepper, Step, StepLabel, Button, withWidth, isWidthUp } from '@material-ui/core'
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

// 公告列表
function NoticeList(props) {

    const history = useHistory()

    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(2)
        },
        eachnotice: {
            width: '100%',
            '& .img': {
                height: 0,
                paddingTop: '60%'
            },
            '& .header': {

            },
        }

    }));

    const classes = useStyles();

    const gotoNoticeDetail = (eachitem) => (event) => {
        // 跳转公告详情
        history.push(`/noticeDetail?id=${eachitem.id}`)
    }

    return (
        <div className={classes.root}>

            <Typography gutterBottom variant="h5" color="textPrimary" component="p">{`${'公告'}`}</Typography>

            <Grid container justify='flex-start' alignItems='center' spacing={2}>
                {
                    props.noticeList.map((eachitem, index) => {
                        return (
                            <Grid item key={eachitem.id} xs={6} sm={4} md={2}>
                                <Card className={classes.eachnotice} onClick={gotoNoticeDetail(eachitem)}>
                                    <CardActionArea>

                                        {/* 公告图片 */}
                                        {eachitem.img && <CardMedia className='img' image={props.appConfig.imgUrl + eachitem.img}></CardMedia>}

                                        {/* 公告内容 */}
                                        <CardContent>
                                            <Typography gutterBottom variant="subtitle1" component="h2">
                                                {eachitem.title}
                                            </Typography>
                                            <Typography variant="overline" color="textSecondary" component="p">
                                                {eachitem.content}
                                            </Typography>
                                        </CardContent>

                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>
        </div>
    );

}

// 使用说明组件
function HowToUseCom(props) {

    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(2)
        }
    }))
    const classes = useStyles()

    const getSteps = () => {
        return [
            {
                title: `${'选择心仪的商品添加心愿单'}`,
                subtitle: `${'在国内淘宝、1688、天猫等购物平台选择您心仪的商品，复制商品链接'}`,
                icon: ''
            },
            {
                title: `${'专属客服与您确认商品及数量'}`,
                subtitle: `${'每一位用户都将分配专属客服，与您确认购买商品的数量和规格等'}`,
                icon: ''
            },
            {
                title: `${'确认无误客服下单，等待送货上门'}`,
                subtitle: `${'与您确认后我们的客服人员会在国内下单并配送至泰国的收货地址'}`,
                icon: ''
            }
        ]
    }

    const steps = getSteps()
    const [currentStep, setCurrentStep] = useState(0)

    // 切换下一个环节
    const moveNext = () => {
        setCurrentStep(currentStep < steps.length - 1 ? currentStep + 1 : 0)
    }

    useEffect(() => {

        let intervalInstance = setInterval(() => {

            // 注意此处，不是直接通过setCurrentStep()修改里面的值，因为闭包原因，如果通过这种方式会一直为0
            setCurrentStep((step) => {
                let moveStep = step < steps.length ? step + 1 : 0
                return moveStep
            })

        }, 1000);

        // 清除副作用
        return () => {
            console.log(`清除了定时器`)
            clearInterval(intervalInstance)
        }

    }, [])

    return (

        <div className={classes.root}>

            <Typography gutterBottom variant="h5" color="textPrimary" component="p">{`${'只需3步,轻松下单'}`}</Typography>

            <Stepper activeStep={currentStep} orientation={isWidthUp('sm', props.width) ? 'horizontal' : 'vertical'}>
                {
                    steps.map((eachstep, index) => {
                        return (
                            <Step key={index}>
                                <StepLabel>{eachstep.title}</StepLabel>
                            </Step>
                        )
                    })
                }
            </Stepper>
        </div>

    )
}

// 推荐商品组件
function RecommendProCom(props) {

    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(2)
        },
        gridList: {
            // width: '100%'
        },
        tileBar: {
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, ' + 'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        }
    }))

    const classes = useStyles()

    return (
        <div className={classes.root}>

            <Typography gutterBottom variant='h5' component='p'>{`${'推荐商品'}`}</Typography>
            <GridList className={classes.gridList} cellHeight={200} spacing={1}>
                {
                    props.proList.map((eachitem, index) => {
                        return (
                            <GridListTile key={eachitem.pid} cols={1} rows={1}>
                                <img src={props.appConfig.imgUrl + eachitem.img} alt={eachitem.title}></img>
                                <GridListTileBar className={classes.tileBar} title={eachitem.title} subtitle={eachitem.price} titlePosition={index % 2 === 0 ? 'bottom' : 'top'}></GridListTileBar>
                            </GridListTile>
                        )
                    })
                }
            </GridList>
        </div>
    )
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
        noticeList: [],
        recommendList: []
    })

    useEffect(
        () => {
            console.log(`更新了数据  开始获取接口内容`)
            // 获取首页的数据
            gethomepagedata().then(response => {
                // 获取首页数据成功
                setState({
                    carouselList: response.data.carouselList,
                    noticeList: response.data.listNotice,
                    recommendList: response.data.recommendList
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
                (state.carouselList && state.carouselList.length > 0) && <SwiperCom carouselArr={state.carouselList} carouselHeight={isWidthUp('sm', props.width) ? '400px' : '300px'} {...props}></SwiperCom>
            }

            {/* 公告列表 */}
            {
                (state.noticeList && state.noticeList.length > 0) && <NoticeList noticeList={state.noticeList} {...props}></NoticeList>
            }

            {/* 如何使用 */}
            {
                <HowToUseCom {...props} />
            }

            {/* 推荐商品列表 */}
            {
                state.recommendList && state.recommendList.length > 0 && <RecommendProCom proList={state.recommendList} {...props}></RecommendProCom>
            }


        </Box>

    )

}

const mapStateToProps = ((state, ownprops) => {
    return { ...ownprops, ...state }
})

export default connect(mapStateToProps, null)(withWidth()(Home))