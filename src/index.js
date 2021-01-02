import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from "redux-thunk";
import reducer from './store/reducer';
import Nav from './components/Nav/Nav';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from "react-router-dom";


// for presisting redux store through page refreshes
import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import CreateAccount from './components/CreateAccount/CreateAccount';
import Home from './components/Home/Home';
import Dashboard from './components/Dashboard/Dashboard';
import LogInOrSignUp from './components/LogInOrSignUp/LogInOrSignUp';
import LogIn from './components/LogIn/LogIn';
import Settings from './components/Settings/Settings';
import RequireAuthComponent from './components/RequireAuthComponent';

import 'materialize-css/dist/css/materialize.min.css';
import './scss/main.scss';

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, reducer)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(persistedReducer, composeEnhancers(
  applyMiddleware(thunk)
));

let persistor = persistStore(store)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <Nav />
        <Switch>
            <Route exact={true} path="/" component={Home}/>
            <Route path="/signup" component={CreateAccount}/>
            <Route path="/login" component={LogIn} />
            <RequireAuthComponent>
              <Route path="/settings" component={Settings} />
              <Route path="/dashboard" component={Dashboard}/>
            </RequireAuthComponent>
            <Redirect to="/" />
        </Switch>
      </BrowserRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('app')
);
