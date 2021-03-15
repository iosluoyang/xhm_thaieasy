import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';

function AuthRoute(props) {
    const {
        appUser,
        path,
        exact,
        routes,
        auth,
        redirectUrl,
    } = props;

    const location = useLocation()

    // 如果需要鉴权
    if (auth) {

        // 已经登录
        if (appUser.user) {

            return (
                <Route exact={exact} path={path} render={
                    routeProps => {
                        return (<props.component {...routeProps} routes={routes}></props.component>)
                    }
                }></Route>
            )

        }
        // 未登录 渲染重定向路由到登录页面
        else {
            return <Redirect to={`/account/login?redirectPath=${location.pathname}`} />
        }
    }
    // 不需要鉴权 直接渲染该路由
    else {

        return (
            <Route exact={exact} path={path} render={
                routeProps => {
                    return (<props.component {...routeProps} routes={routes}></props.component>)
                }
            }></Route>
        )
    }

}

const mapStateToProps = ((storeState, ownProps) => {
    return { ...ownProps, ...storeState }
})

export default connect(mapStateToProps, null)(AuthRoute);