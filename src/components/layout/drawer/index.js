import React from 'react'
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import { AccessAlarm, ThreeDRotation } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto'
    }
}))

function AppDrawer(props) {

    const classes = useStyles()

    // 点击关闭drawer
    const toggleDrawer = () => (event) => {
        props.onToggleDrawer(false)
    }

    const list = (direction) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: direction === 'top' || direction === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {['Index1', 'Index2', 'Index3', 'Index4'].map((text, index) => (
                    <ListItem button key={index}>
                        <ListItemIcon>{index % 2 === 0 ? <AccessAlarm /> : <ThreeDRotation />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Index5', 'Index6', 'Index7'].map((text, index) => (
                    <ListItem button key={index}>
                        <ListItemIcon>{index % 2 === 0 ? <AccessAlarm /> : <ThreeDRotation />}</ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    )

    return (
        <Drawer anchor={props.direction} open={props.open} onClose={toggleDrawer(false)}>
            {list(props.direction)}
        </Drawer>
    )
}

export default AppDrawer