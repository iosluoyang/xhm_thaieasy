import React from "react";
import { Switch, Route } from 'react-router-dom';
import routers from './router'
import { Provider } from 'react-redux'
import store from './store'
import './App.css';


import Layout from './components/layout'
import Home from './pages/home'
import Content from './pages/content'
import Me from './pages/me'
import Login from './pages/login'

function App() {

  return (

    <div className="App">
        
        {
            <Switch>
              {
                routers.map((route, index) => {
                  return (
    
                    <Route key={index} exact={route.exact} path={route.path}
                            render = { props => (
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
