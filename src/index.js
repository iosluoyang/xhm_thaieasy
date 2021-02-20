import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './store'
import App from './App';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <Router>
    {/* 将store作为prop传入 使应用中的所有组件均可使用store */}
    <Provider store={store}>
      <App />
    </Provider>
  </Router>,
  // <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
