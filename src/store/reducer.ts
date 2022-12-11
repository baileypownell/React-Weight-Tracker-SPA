import * as actionTypes from './actionTypes';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    firebaseAuthID: null,
  },
  userLoggedIn: false,
  uid: '',
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
        uid: action.uid,
        userLoggedIn: true
      };
    case actionTypes.SET_USER_LOGGED_OUT:
      return {
        ...state,
        user: {
          firstName: '',
          lastName: '',
          email: '',
          firebaseAuthID: '',
        },
        uid: '',
        userLoggedIn: false,
        error: ''
    }
    case actionTypes.DELETE_USER:
      return {
        ...state,
        user: {
          firstName: '',
          lastName: '',
          email: '',
          firebaseAuthID: '',
        },
        uid: '',
        userLoggedIn: false,
        error: ''
    }
    case actionTypes.SET_USER_DATA:
      return {
        ...state,
        user: {
          ...state.user,
          firstName: action.firstName,
          lastName: action.lastName,
        }
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
        uid: action.uid,
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
        }
      }
    default:
      return state;
  }
};

export default reducer;
