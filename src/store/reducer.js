import * as actionTypes from './actions';
import axios from 'axios';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    firebaseAuthID: '',
    idToken: '',
    userId: ''
  },
  userLoggedIn: false,
  todaysWeight: '',
  weightHistory: []
};

let userId;
let idToken;


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_LOGGED_IN:

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
        idToken = localStorage.idToken;
        localStorage.setItem('expirationDate', expirationDate);
        localStorage.setItem('userId', response.data.localId);
        userId = localStorage.userId;
      }
    ).catch(err => {
      console.log(err);
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
    case actionTypes.SET_USER_TOKEN_AND_ID:
      return {
        ...state,
        user: {
          ...state.user,
          idToken: action.idToken,
          userId: action.userId
        }
      }
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
          firebaseAuthID: '',
          idToken: '',
          userId: ''
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
    case actionTypes.CHANGE_PASSWORD:
      const payload = {
        requestType: 'PASSWORD_RESET',
        email: action.email
      }
      axios.post("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk").then(response => {
        console.log(response);
      }).catch(err => {
        console.log(err);
      return {
        ...state
      }
    });
    case actionTypes.CHANGE_EMAIL:
      const payloadEmail = {
        idToken: action.idToken,
        email: action.newEmail,
        returnSecureToken: true
      }
      axios.post("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payloadEmail).then(response => {
        console.log(response);
      }).catch(err => {
        console.log(err);
      return {
        ...state
      }
    });
    default:
      return state;
  }
};

export default reducer;
