import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import reportWebVitals from './reportWebVitals';
//antd
import 'antd/dist/antd.css'
import '@ant-design/pro-card/dist/card.css';
import '@ant-design/pro-layout/dist/layout.css';
// redux
import { Provider } from 'react-redux';
import { createStore } from 'redux'
import reducer from './reducer'
import './rem' //导入Rem配置
import './index.css';
// zhengdian test

// test chenletian
ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <Provider store={createStore(reducer)}>
        <App />
      </Provider>
      
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
