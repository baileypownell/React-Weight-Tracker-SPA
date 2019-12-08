import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from "redux-thunk";
import reducer from './store/reducer';
import Nav from './components/Nav';
import {
  BrowserRouter,
  Switch,
  Route,
  Link
} from "react-router-dom";

// for presisting redux store through page refreshes
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import CreateAccount from './components/CreateAccount';
import Home from './components/Home';
import LogIn from './components/LogIn';
import Program from './components/Program/Program';
import LogInOrSignUp from './components/LogInOrSignUp';

import './scss/main.scss';

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, reducer)

// // initialize the redux store
// const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

// initialize the redux store
let store = createStore(persistedReducer, applyMiddleware(thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
let persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Nav/>
        <Route exact={true} path="/" component={Home}/>
        <Route path="/createAccount" component={CreateAccount}/>
        <Route path="/logIn" component={LogIn}/>
        <Route path="/Program" component={Program}/>
        <Route path="/LogInOrSignUp" component={LogInOrSignUp}/>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('app')
);
