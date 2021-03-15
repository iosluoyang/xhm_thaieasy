import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Box } from '@material-ui/core';
import AuthRoute from '@/components/AuthRoute';

export default function WishProduct(props) {

    const { routes } = props
    let match = useRouteMatch()

    return (
        <Box>
            {/* 中间内容区域 */}
            <Switch>
                {
                    routes &&
                    routes.map((route) => {
                        return (
                            <AuthRoute key={route.path} {...{ ...route, ...{ path: match.url + route.path } }} ></AuthRoute>
                        )
                    })
                }
            </Switch>

        </Box>
    )
}