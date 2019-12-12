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
  todaysWeight: null,
  weightHistory: [],
  error: ''
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
        weightHistory: null,
        error: ''
    }
    case actionTypes.DELETE_USER:
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
        weightHistory: null,
        error: ''
    }
    case actionTypes.SET_USER_DATA:
      return {
        ...state,
        user: {
          ...state.user,
          firstName: action.firstName,
          lastName: action.lastName,
        },
        weightHistory: action.weightHistory,
        todaysWeight: action.todaysWeight
      };
    case actionTypes.SET_TODAYS_WEIGHT:
      return {
        ...state,
        user: {
          ...state.user
        },
        todaysWeight: action.todaysWeight
      };
    case actionTypes.CREATE_ACCOUNT:
      return {
        ...state,
        user: {
          ...state.user,
          email: action.email,
          firstName: action.firstName,
          lastName: action.lastName,
          firebaseAuthID: action.firebaseAuthID,
        },
        userLoggedIn: true,
        expiresIn: action.expiresIn,
        idToken: action.idToken,
        localId: action.localId,
        refreshToken: action.refreshToken
      };
    case actionTypes.CHANGE_FIRST_NAME:
      return {
        ...state,
        user: {
          ...state.user,
          firstName: action.firstName
        }
      }
      case actionTypes.CHANGE_LAST_NAME:
        return {
          ...state,
          user: {
            ...state.user,
            lastName: action.lastName
          }
        }
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
          email: action.newEmail
        },
        idToken: action.idToken
      }
    default:
      return state;
  }
};

export default reducer;
