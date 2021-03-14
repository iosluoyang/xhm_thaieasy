import React, { Suspense } from "react";
import { Switch } from 'react-router-dom';
import routes from '@/router'
import { CircularProgress } from '@material-ui/core'
import '@/App.css';
import GlobalSnackbar from '@/components/globalSnackbar';
import GlobalDialog from "@/components/globalDialog";
import GlobalLoading from '@/components/globalLoading';
import AuthRoute from '@/components/AuthRoute';

function App() {

  return (

    <div className="App">

      {/* 全局Toast框 */}
      <GlobalSnackbar />
      {/* 全局Loading框 */}
      <GlobalLoading />
      {/* 全局Dialog框 */}
      <GlobalDialog />
      <Suspense fallback={<CircularProgress />}>
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
