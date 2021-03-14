import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Box } from '@material-ui/core';
import AuthRoute from '@/components/AuthRoute';

export default function Account(props) {

    const { routes } = props
    let match = useRouteMatch()

    return (
        <Box>

            {/* 中间内容区域 */}
            <Switch>
                {
                    routes.map((route, index) => {
                        return (
                            <AuthRoute key={route.path} {...{ ...route, ...{ path: match.url + route.path } }} ></AuthRoute>
                        )
                    })
                }
            </Switch>

        </Box>
    )
}