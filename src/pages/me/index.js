import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'


function Me() {

    const useStyles = makeStyles({
        root: {
            minHeight: '100%',
            paddingTop: '60px',
            paddingBottom: '56px',
            boxSizing: 'border-box'
        }
    });

    const classes = useStyles();

    console.log(`开始一次调用`)
    let initSearchText = '我是初始searchtext'
    const [searchText, setSearchText] = useState(initSearchText)
    const [count, setCount] = useState(0)

    const startToSearch = () => {
        console.log(`开始搜索`)
        console.log(`搜索文本为:${initSearchText}`)
    }

    return (
        <Box className={classes.root} bgcolor='success.main'>
            <Typography variant='caption' color='textPrimary'>{`${'个人中心'}`}</Typography>
            <p>{`当前点击次数为${count.toString()}`}</p>
            <div style={{ marginTop: 20 }} onClick={() => { setCount(count + 1) }}>{`点击+1`}</div>
            <input value={searchText} onChange={(e) => { setSearchText(e.target.value); initSearchText = e.target.value }}></input>

            <div>{`当前的initSearchText为:${searchText}`}</div>

            <button onClick={startToSearch}>点击开始搜索</button>

        </Box>
    )
}

class Me2 extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            count: 0,
            searchText: ''
        }
    }

    componentDidMount() {
        this.initSearchText = '初始化的searchText'
        setTimeout(() => {
            console.log(this)
            this.initSearchText = '自动更改后的searchText'
        }, 2000);
    }

    startToSearch = () => {
        console.log(`开始搜索`)
        console.log(`搜索文本为:${this.initSearchText}`)
    }

    render() {


        return (
            <Box bgcolor='success.main'>
                <Typography variant='caption' color='textPrimary'>{`${'个人中心'}`}</Typography>
                <p>{`当前点击次数为${this.state.count.toString()}`}</p>
                <div style={{ marginTop: 20 }} onClick={() => { this.setState({ count: this.state.count + 1 }) }}>{`点击+1`}</div>
                <input value={this.state.searchText} onChange={(e) => { this.setState({ searchText: e.target.value }); this.initSearchText = e.target.value }}></input>

                <div>{`当前的initSearchText为:${this.initSearchText}`}</div>

                <button onClick={this.startToSearch}>点击开始搜索</button>

            </Box>
        )
    }
}

export default Me2