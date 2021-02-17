import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import { BottomNavigation, BottomNavigationAction } from '@material-ui/core'
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

export default function TabBar(props) {

    const useStyles = makeStyles({
        root: {
            width: '100%',
            position: 'fixed',
            bottom: '0',
            left: '0',
            right: '0'
        },
    });

    const classes = useStyles();
    const [currenttabvalue, setCurrentTabValue] = useState(props.currentTabValue)

    return (
        <BottomNavigation
            value={currenttabvalue || 'home'}
            onChange={(event, newValue) => {
                setCurrentTabValue(newValue)
            }}
            showLabels
            className={classes.root}
        >
            <BottomNavigationAction label="Home" value='home' component={Link} to="/" icon={<HomeIcon />} />
            <BottomNavigationAction label="Content" value='content' component={Link} to="/content" icon={<FavoriteIcon />} />
            <BottomNavigationAction label="Me" value='me' component={Link} to="/me" icon={<LocationOnIcon />} />
        </BottomNavigation>
    );

}