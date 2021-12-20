import React from 'react';
import logo from './logo.svg';
import './App.css';

//自定义组件
import Title from './components/title/Title';
import Current from './components/current/current';
import Dictionary from './components/dictionary/dictionary';

function App() {
  return (
    <div className="App">
      <Title></Title>
      {/* <Current></Current> */}
      {/* <Dictionary></Dictionary> */}
    </div>
  );
}

export default App;
