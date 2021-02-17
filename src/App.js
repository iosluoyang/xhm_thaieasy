import React from "react";
import './App.css';
import Layout from './components/layout'
import CssBaseline from '@material-ui/core/CssBaseline';

class App extends React.Component {

  render() {
    return (

      <React.Fragment>

        {/* 基线组件 修复浏览器设备的不一致性 */}
        <CssBaseline />

        <Layout />

      </React.Fragment>

    );

  }

}

export default App;
