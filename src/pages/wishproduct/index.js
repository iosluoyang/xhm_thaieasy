import React from 'react';
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { Box } from '@material-ui/core';

export default function WishProduct(props) {

    const { routes } = props
    let match = useRouteMatch()

    return (
        <Box>

            {/* 中间内容区域 */}
            <Switch>
                {
                    routes.map((route, index) => {
                        return (
                            <Route exact={route.exact} key={index} path={ match.url + route.path} component={route.component} />
                         )
                    })
                }
            </Switch>

        </Box>
    )
}