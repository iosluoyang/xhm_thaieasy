import React, { Suspense, useEffect } from "react";
import { Switch } from 'react-router-dom';
import routes from '@/router';
import { LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import '@/App.css';
import GlobalSnackbar from '@/components/globalSnackbar';
import GlobalDialog from "@/components/globalDialog";
import GlobalLoading from '@/components/globalLoading';
import AuthRoute from '@/components/AuthRoute';
import store from './store';
import { actionGetConfigData } from './store/actionCreator'

function App() {

  const useStyles = makeStyles((theme) => ({
    App: {
      height: '100vh'
    }
  }))

  const classes = useStyles()

  useEffect(() => {

    // 获取配置信息
    store.dispatch(actionGetConfigData()).then(configData => {
      console.log(`获取配置信息成功:${JSON.stringify(configData)}`)
    }).catch(error => {
      console.log(`获取配置信息失败:${error.msg}`)
    })

  }, [])

  return (

    <div className={classes.App}>

      {/* 全局Toast框 */}
      <GlobalSnackbar />
      {/* 全局Loading框 */}
      <GlobalLoading />
      {/* 全局Dialog框 */}
      <GlobalDialog />
      <Suspense fallback={<LinearProgress />}>
        <Switch>
          {
            routes.map((route, index) => {
              return (

                <AuthRoute key={route.path} {...route}></AuthRoute>
                // <Route key={index} exact={route.exact} path={route.path}
                //   render={props => (
                //     // 传递嵌套路由到子组件
                //     <route.component {...props} routes={route.routes} />
                //   )}
                // ></Route>
              )
            })
          }
        </Switch>
      </Suspense>

    </div>

  );
}

export default App;
