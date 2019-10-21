import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './scss/main.scss';

// import Nav from './components/nav';
import App from './components/app';
import './scss/main.scss';

// ReactDOM.render(
//   <Nav/>,
//   document.getElementById('nav')
// );

ReactDOM.render(
  <BrowserRouter>
    <App/>
  </BrowserRouter>,
  document.getElementById('app')
);
