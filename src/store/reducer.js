import * as actionTypes from './actions';
import axios from 'axios';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    firebaseAuthID: ''
  },
  userLoggedIn: false,
  todaysWeight: '',
  weightHistory: []
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_LOGGED_IN:
    console.log('user is signed in');
    const authData = {
      email: action.email,
      password: action.password,
      returnSecureToken: true
    }
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", authData)
    .then(response => {
        console.log(response);
        let expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
        localStorage.setItem('token', response.data.idToken);
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', response.data.localId);
      }
    ).catch(err => {
      console.log(err);
      dispatch(authFail(err.response.data.error));
    });
      return {
        ...state,
        user: {
          ...state.user,
          firstName: action.firstName,
          lastname: action.lastName,
          email: action.email,
          password: action.password,
          firebaseAuthID: action.firebaseAuthID
        },
        userLoggedIn: true,
        weightHistory: action.weightHistory
      };
    case actionTypes.SET_USER_LOGGED_OUT:
      localStorage.removeItem('token');
      localStorage.removeItem('expirationDate');
      localStorage.removeItem('userId');
      return {
        user: {
          firstName: '',
          lastName: '',
          email: '',
          todaysWeight: '',
          password: '',
          firebaseAuthID: ''
        },
        userLoggedIn: false,
        todaysWeight: '',
        weightHistory: null
    };
    case actionTypes.SET_TODAYS_WEIGHT:
      return {
        ...state,
        user: {
          ...state.user
        },
        todaysWeight: action.todaysWeight
      };
    default:
      return state;
  }
};

export default reducer;
