import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles'
import {
    Box, Grid, Card, CardActionArea, CardMedia, CardContent, Typography,
    Accordion, AccordionSummary, AccordionDetails, LinearProgress,
    GridList, GridListTile, GridListTileBar, Stepper, Step, StepLabel, StepContent, Button, withWidth, isWidthUp, Divider, Container, Hidden, isWidthDown
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import TouchAppTwoToneIcon from '@material-ui/icons/TouchAppTwoTone';
import GuideShopping from '../../assets/imgs/guide/ic_shopping.png'
import GuideChatting from '../../assets/imgs/guide/ic_chatting.png'
import GuideDelivery from '../../assets/imgs/guide/ic_delivery.png'

import { gethomepagedataapi } from '../../api/homeapi';
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

            height: props.comHeight,
            borderRadius: '10px',

            '& .eachslide': {

                width: '100%',
                height: '100%',

                '& .img': {
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    display: 'block',
                    objectFit: 'cover'
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

        <Box padding={2}>

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
                    props.dataArr.map((eachitem, index) => {
                        return (
                            <SwiperSlide key={index} className='eachslide' onClick={clickSlide(eachitem)}>
                                <img className='img' src={props.appConfig.imgUrl + eachitem.img} alt={eachitem.img}></img>
                            </SwiperSlide>
                        )
                    })
                }

            </Swiper>

        </Box>

    )

}

// 公告列表
function NoticeList(props) {

    const history = useHistory()

    const useStyles = makeStyles((theme) => ({
        root: {

        },
        eachitem: {
            width: '100%',
            '& .img': {
                height: 0,
                paddingTop: '62.5%'
            },
        }

    }));

    const classes = useStyles();

    const gotoNoticeDetail = (eachitem) => (event) => {
        // 跳转公告详情
        history.push(`/noticeDetail?id=${eachitem.id}`)
    }

    return (
        <Box className={classes.root} padding={2}>

            <Typography gutterBottom variant="h5" color="textPrimary" component="p" style={{ textAlign: 'center' }}>{`${'公告'}`}</Typography>

            <Grid container alignItems='center' spacing={2}>
                {
                    props.dataArr.map((eachitem, index) => {
                        return (
                            <Grid item key={eachitem.id} xs={6} sm={4}>
                                <Card className={classes.eachitem} onClick={gotoNoticeDetail(eachitem)}>
                                    <CardActionArea>

                                        {/* 公告图片 */}
                                        {eachitem.img && <CardMedia className='img' image={props.appConfig.imgUrl + eachitem.img}></CardMedia>}

                                        {/* 公告内容 */}
                                        <CardContent>
                                            <Typography gutterBottom variant="subtitle1" color="textPrimary" component="h2">
                                                {eachitem.title}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary" component="p">
                                                {eachitem.createDate}
                                            </Typography>
                                        </CardContent>

                                    </CardActionArea>
                                </Card>
                            </Grid>
                        )
                    })
                }
            </Grid>

        </Box>
    );

}

// 使用说明组件
function HowToUseCom(props) {

    const useStyles = makeStyles((theme) => ({
        root: {
            padding: theme.spacing(2)
        },
    }))
    const classes = useStyles()

    const getSteps = () => {
        return [
            {
                title: `${'选择心仪的商品添加心愿单'}`,
                subtitle: `${'在国内淘宝、1688、天猫等购物平台选择您心仪的商品，复制商品链接'}`,
                icon: GuideShopping
            },
            {
                title: `${'专属客服与您确认商品及数量'}`,
                subtitle: `${'每一位用户都将分配专属客服，与您确认购买商品的数量和规格等'}`,
                icon: GuideChatting
            },
            {
                title: `${'确认无误客服下单，等待送货上门'}`,
                subtitle: `${'与您确认后我们的客服人员会在国内下单并配送至泰国的收货地址'}`,
                icon: GuideDelivery
            }
        ]
    }

    const steps = getSteps()
    const [currentStep, setCurrentStep] = useState(0)

    const intervalRef = useRef()

    //自定义步骤条icon
    function CustomStepIcon(props) {

        const useStyles = makeStyles((theme) => ({
            stepIcon: {
                width: '50px',
                height: '50px',
                objectFit: 'contain',
            }
        }))

        const classes = useStyles()
        const { active, completed } = props;

        return (
            <img className={classes.stepIcon} src={steps[props.icon - 1].icon} alt={props.icon}></img>
        );

    }

    const clickStep = (index) => (event) => {

        // 清除定时器
        clearInterval(intervalRef.current)

        // 设置当前的激活索引
        setCurrentStep(index)

    }

    useEffect(() => {

        let intervalInstance = setInterval(() => {

            // 注意此处，不是直接通过setCurrentStep()修改里面的值，因为闭包原因，如果通过这种方式会一直为0
            setCurrentStep((step) => {
                let moveStep = step < steps.length ? step + 1 : 0
                return moveStep
            })

        }, 5000);

        intervalRef.current = intervalInstance

        // 清除副作用
        return () => {
            clearInterval(intervalRef.current)
        }

    }, [])

    return (

        <Box className={classes.root}>

            <Typography gutterBottom variant="h5" color="textPrimary" component="p" style={{ textAlign: 'center' }}>{`${'只需3步,轻松使用'}`}</Typography>

            <Stepper activeStep={currentStep} orientation='vertical'>
                {
                    steps.map((eachitem, index) => {
                        return (
                            <Step key={index} onClick={clickStep(index)}>

                                <StepLabel StepIconComponent={CustomStepIcon}>{eachitem.title}</StepLabel>
                                {

                                    <StepContent>
                                        <Typography variant='overline' color='textSecondary'>{eachitem.subtitle}</Typography>
                                    </StepContent>

                                }

                            </Step>
                        )
                    })
                }
            </Stepper>

        </Box>

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

            minHeight: '100%',
            paddingTop: '60px',
            paddingBottom: '56px',
            boxSizing: 'border-box'

        }
    }))
    const classes = useStyles()

    const history = useHistory()

    const [state, setState] = useState({
        carouselList: [],
        noticeList: [],
        recommendList: []
    })

    useEffect(
        () => {
            console.log(`更新了数据  开始获取接口内容`)
            // 获取首页的数据
            gethomepagedataapi().then(response => {
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

        <Box className={classes.root} bgcolor="info.main">

            {/* 轮播图 */}
            {
                (state.carouselList && state.carouselList.length > 0) && <SwiperCom dataArr={state.carouselList} comHeight={isWidthUp('sm', props.width) ? '400px' : '150px'} {...props}></SwiperCom>
            }

            {/* 开始订购按钮 */}
            <Box display='flex' justifyContent='center'>
                <Button variant='contained' color='secondary' size='large' endIcon={<TouchAppTwoToneIcon />} onClick={() => { history.push('/wishproduct/handleproduct/add') }}>{`${'开始购买'}`}</Button>
            </Box>

            {/* 公告列表 */}
            {
                (state.noticeList && state.noticeList.length > 0) && <NoticeList dataArr={state.noticeList} {...props}></NoticeList>
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