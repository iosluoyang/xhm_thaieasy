import React from "react";
import { Switch, Route } from 'react-router-dom';
import routes from './router'
import './App.css';
import GlobalSnackbar from './components/globalSnackbar';
import GlobalDialog from "./components/globalDialog";

function App() {

  return (

    <div className="App">

      {/* 全局Toast框 */}
      <GlobalSnackbar />
      {/* 全局Dialog框 */}
      <GlobalDialog />

      {
        <Switch>
          {
            routes.map((route, index) => {
              return (

                <Route key={index} exact={route.exact} path={route.path}
                  render={props => (
                    // 传递嵌套路由到子组件
                    <route.component {...props} routes={route.routes} />
                  )}
                ></Route>
              )
            })
          }
        </Switch>
      }

    </div>

  );
}

export default App;
