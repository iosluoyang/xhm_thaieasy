import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { Box, BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

export default function TabBar(props) {

    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0',
        },
    }));
    const classes = useStyles();

    const owntabs = [
        {
            title: `${'首页'}`,
            value: '/',
            link: '/',
            icon: <HomeIcon />
        },
        {
            title: `${'任务单'}`,
            value: '/mission',
            link: '/mission',
            icon: <FavoriteIcon />
        },
        {
            title: `${'我'}`,
            value: '/me',
            link: '/me',
            icon: <LocationOnIcon />
        }
    ]
    const [tabs, setTabs] = useState(owntabs)

    const location = useLocation()
    const [currenttabvalue, setCurrentTabValue] = useState(location.pathname)

    return (
        <Box borderTop={1} borderColor='grey.200' className={classes.root}>
            <BottomNavigation
                value={currenttabvalue || '/'}
                onChange={(event, newValue) => {
                    setCurrentTabValue(newValue)
                }}
                showLabels
            >
                {
                    tabs.map((eachitem, index) => {
                        return <BottomNavigationAction key={index} label={eachitem.title} value={eachitem.value} component={Link} to={eachitem.link} icon={eachitem.icon} />
                    })
                }
            </BottomNavigation>
        </Box>
    );

}