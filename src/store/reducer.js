import * as actionTypes from './actions';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    weightHistory: {},
    todaysWeight: '',
    password: ''
  },
  userLoggedIn: false
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_LOGGED_IN:
      return {
        user: {
          ...state.user,
          firstName: action.firstName
        },
        userLoggedIn: true
      };
    case actionTypes.SET_USER_LOGGED_OUT:
      return {
        user: {
          firstName: '',
          lastName: '',
          email: '',
          weightHistory: {},
          todaysWeight: '',
          password: ''
        },
        userLoggedIn: false
    };
    case actionTypes.SET_TODAYS_WEIGHT:
    console.log('reducer is running');
    console.log(action);
      return {
        ...state,
        user: {
          ...state.user,
          todaysWeight: action.todaysWeight
        }
      };
    default:
      return state;
  }
};

export default reducer;
