import React, { useState, useEffect } from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Container, Card, CardActions, CardContent, Button, Typography, TextField } from '@material-ui/core'
import { gethomepagedata } from '../../api/homeapi'
import store from '../../store'

// 轮播图组件
function CarouselEl(props) {

    const useStyles = makeStyles(theme => ({
        spacecarousel: {

        }
    }))
    const classes = useStyles()
    const theme = useTheme()

    const [slideIndex, setSlideIndex] = useState(0)
    const [imgHeight, setImgHeight] = useState(200)

    return (

        null

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

        <Container className='home'>

            <h1>你好</h1>

            {/* 轮播图 */}
            {
                state.carouselArr && state.carouselArr.length > 0 ?
                    <CarouselEl dataArr={state.carouselArr}></CarouselEl> : null
            }

            {/* 通知卡片内容 */}
            <NoticeList dataArr={state.noticeList}></NoticeList>

            {/* 搜索框 */}
            <TextField id="standard-basic" label="搜索您想要的商品" />


        </Container>

    )

}

export default Home