import { ThemeProvider } from '@mui/material/styles';
import { Provider } from 'react-redux';
import {
  BrowserRouter,
  Route, Routes
} from "react-router-dom";
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from "redux-thunk";
import Nav from './components/Nav';
import reducer from './store/reducer';

import { persistReducer, persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';

import CreateAccount from './components/CreateAccount';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/Home';
import LogIn from './components/LogIn';

import { Box } from '@mui/material';
import './app.scss';
import RequireAuthComponent from './components/RequireAuthComponent';
import theme from './theme';

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, reducer)

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(persistedReducer, composeEnhancers(
  applyMiddleware(thunk)
));

let persistor = persistStore(store)

console.log('VITE_FIREBASE_API_KEY: ', import.meta.env.VITE_FIREBASE_API_KEY)
console.log('VITE_FIREBASE_API_KEY: ', import.meta.env.FIREBASE_API_KEY)

const App = () => {
  return (
    <Box display="grid" sx={{
      height: '100vh',
      gridTemplateRows: 'auto 1fr'
    }}>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <BrowserRouter>
            <Nav />
            <Box display="flex" alignItems="center" justifyContent="center">
              <Routes>
              <Route path="/" element={<Home />}/>
              <Route path="/signup" element={<CreateAccount />}/>
              <Route path="/login" element={<LogIn />} />
              <Route 
                path="/dashboard"
                element={
                <RequireAuthComponent>
                  <Dashboard />
                </RequireAuthComponent>
              }/>
            </Routes>
            </Box>
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </ThemeProvider>
    </Box>
  )
};

export default App