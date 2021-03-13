import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

function AuthRoute(props) {
    const {
        appUser,
        appConfig,
        path,
        exact,
        routes,
        auth,
        redirectUrl,
    } = props;

    // 如果需要鉴权
    if (auth) {

        // 已经登录
        if (appUser.user) {
            return <Route exact={exact} path={path} render={routeProps => (<props.component {...routeProps} routes={routes}></props.component>)}></Route>
        }
        // 未登录 渲染重定向路由到登录页面
        else {
            return <Redirect to='/account/login' />
        }
    }
    // 不需要鉴权 直接渲染该路由
    else {
        return <Route exact={exact} path={path} render={routeProps => (<props.component {...routeProps} routes={routes}></props.component>)}></Route>
    }

}

const mapStateToProps = ((storeState, ownProps) => {
    return { ownProps, ...storeState }
})

export default connect(mapStateToProps, null)(AuthRoute);