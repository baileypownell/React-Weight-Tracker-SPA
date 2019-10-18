import React from 'react';
import ReactDOM from 'react-dom';

import Nav from './components/nav';
import App from './components/app';
import './scss/main.scss';

ReactDOM.render(
  <Nav/>,
  document.getElementById('nav')
);

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);
