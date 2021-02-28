import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Box, MobileStepper, Card, CardActions, CardContent, Button, Typography, TextField } from '@material-ui/core'
import { KeyboardArrowRight, KeyboardArrowLeft } from '@material-ui/icons'
import { gethomepagedata } from '../../api/homeapi'
import store from '../../store'
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';

// 轮播图组件
function CarouselEl(props) {

    const history = useHistory()
    const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

    const useStyles = makeStyles(theme => ({

        carousel: {
            width: '100%',
            height: props.carouselHeight,
            position: 'relative',
            '& .topview': {
                width: '100%',
                height: '100%',
                '& .react-swipeable-view-container': {
                    height: '100%'
                },
                '& .eachslide': {
    
                    width: '100%',
                    height: '100%',
    
                    '& .img': {
                        width: '100%',
                        height: '100%',
                        display: 'block',
                    }
                },
            },
            '& .bottomview': {
                height: '20px',
                bottom: '0',
                left: '0',
                right: '0'
            }
            
        }
    }))

    const classes = useStyles()
    const theme = useTheme()

    const [activeIndex, setActiveIndex] = useState(0)

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

        <div className={classes.carousel}>

            {/* 轮播图 */}
            <AutoPlaySwipeableViews
                className='topview'
                axis={theme.direction == 'rtl' ? 'x-reverse' : 'x'}
                index={activeIndex}
                onChangeIndex={ (index) => {setActiveIndex(index)} }
                enableMouseEvents
            >
                {
                    props.carouselArr.map((eachitem, index) => {
                        return (
                            <div key={index} className='eachslide' onClick={clickSlide(eachitem)}>
                                <img className='img' src={ props.appConfig.imgUrl + eachitem.img }></img>
                            </div>
                        )
                    })
                }
            </AutoPlaySwipeableViews>
            
            {/* 步进器 */}
            <MobileStepper
                className='bottomview'
                steps={props.carouselArr.length}
                position="bottom"
                variant="dots"
                activeStep={activeIndex}
                nextButton={
                  <Button size="small" onClick={setActiveIndex(activeIndex + 1)} disabled={activeIndex === props.carouselArr.length - 1}>
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                  </Button>
                }
                backButton={
                  <Button size="small" onClick={setActiveIndex(activeIndex - 1)} disabled={activeIndex === 0}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  </Button>
                }
            />

        </div>

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

            // 获取首页的数据
            gethomepagedata().then(response => {
                // 获取首页数据成功
                console.log(response)
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
                (state.carouselArr && state.carouselArr.length > 0) && <CarouselEl carouselArr={state.carouselArr} carouselHeight={300} {...props}></CarouselEl>
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
    return {...ownprops, ...state}
})

export default connect(mapStateToProps, null)(Home)