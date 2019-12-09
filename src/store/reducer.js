import * as actionTypes from './actionTypes';
// need to remove after outsourcing to redux thunk...
import axios from 'axios';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    firebaseAuthID: '',
  },
  userLoggedIn: false,
  expiresIn: '',
  idToken: '',
  localId: '',
  refreshToken: '',
  todaysWeight: '',
  weightHistory: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_LOGGED_IN:
      return {
        ...state,
        user: {
          ...state.user,
          email: action.email,
        },
        expiresIn: action.expiresIn,
        idToken: action.idToken,
        localId: action.localId,
        refreshToken: action.refreshToken,
        userLoggedIn: true,
        weightHistory: action.weightHistory
      };
    case actionTypes.SET_USER_LOGGED_OUT:
      return {
        ...state,
        user: {
          firstName: '',
          lastName: '',
          email: '',
          firebaseAuthID: ''
        },
        expiresIn: '',
        idToken: '',
        localId: '',
        refreshToken: '',
        userLoggedIn: false,
        todaysWeight: '',
        weightHistory: null
    }
    case actionTypes.SET_USER_DATA:
      return {
        ...state,
        user: {
          ...state.user,
          firstName: action.firstName,
          lastName: action.lastName,
        },
        weightHistory: action.weightHistory
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
      return {
        ...state,
        user: {
          ...state.user
        }
      }
    case actionTypes.CHANGE_EMAIL:
      return {
        ...state,
        user: {
          ...state.user,
          email: action.newEmail,
          idToken: action.idToken
        }
      }
    default:
      return state;
  }
};

export default reducer;
