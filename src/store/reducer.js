import * as actionTypes from './actions';

const initialState = {
  user: {
    firstName: '',
    lastName: '',
    email: '',
    weightHistory: {},
    password: ''
  },
  userLoggedIn: false
};


const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_FIRST_NAME:
       return {
         ...state,
         user: {
           ...state.user,
           firstName: action.firstName
         }
       };
    case actionTypes.SET_USER_LOGGED_IN:
      return {
        ...state,
        userLoggedIn: true
      };
    default:
      return state;
  }
};

export default reducer;
