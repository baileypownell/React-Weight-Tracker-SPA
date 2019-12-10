import axios from 'axios';
import * as actionTypes from './actionTypes';

export const createAccount = (firstName, lastName, email, firebaseAuthID) => {
  return {
    type: actionTypes.CREATE_ACCOUNT,
    email: email,
    firstName: firstName,
    lastName: lastName,
    firebaseAuthID: firebaseAuthID
  }
}

// export const createAccountAsync = (firstName, lastName, email, firebaseAuthID) => {
//   return dispatch => {
//     console.log('here');
//     const db = firebase.firestore();
//       db.collection("users").add({
//         firstName: firstName,
//         lastName: lastName,
//         email: email,
//         firebaseAuthID: firebaseAuthID,
//         weights: []
//       })
//     dispatch(createAcount(firstName, lastName, email, firebaseAuthID))
//   }
// }

export const loginUser = (email, expiresIn, idToken, localId, refreshToken) => {
  return {
    type: actionTypes.SET_USER_LOGGED_IN,
    email: email,
    expiresIn: expiresIn,
    idToken: idToken,
    localId: localId,
    refreshToken: refreshToken
  }
}

export const setUserData = (firstName, lastName, weightHistory) => {
  return {
    type: actionTypes.SET_USER_DATA,
    firstName: firstName,
    lastName: lastName,
    weightHistory: weightHistory
  }
}

// thunk action creator
export const getUserDataAsync = (localId) => {
  return (dispatch, getState) => {
    // grab current state
    const state = getState();
    let firstName, lastName, weightHistory;
    // based on the localId, which is the firebaseAuthID property in the "users" database, get information specific to the user
    const db = firebase.firestore();
    db.collection("users").get().then((querySnapshot) => {
      let userData;
      let localId = state.localId;
      const data = querySnapshot.docs.map(doc => doc.data());
      data.forEach((item) => {
        if (item.firebaseAuthID == localId) {
          userData = item;
          firstName = item.firstName;
          lastName = item.lastName;
          weightHistory = item.weights;
          // now update Redux
          dispatch(setUserData(firstName, lastName, weightHistory));
          return;
        }
      });
      console.log(userData);
    });
  }
}


export const logoutUser = () => {
  return {
    type: actionTypes.SET_USER_LOGGED_OUT
  }
}

//thunk
export const logoutUserAsync = () => {
  return dispatch => {
    firebase.auth().signOut().then(() => {
      // change redux state
      dispatch(logoutUser());
    })
  }
}



const changeEmailAsync = (idToken, newEmail) => {
  return {
    type: actionTypes.CHANGE_EMAIL,
    idToken: idToken,
    newEmail: newEmail
  }
}

// redux-thunk in action = using dispatch as a return value, and only when request has resolved do we dispatch an action itself. Then, wherever we need to call the async function in our project, we use mapDispatchToProps to call the async function with the required parameters
export const changeEmail = (idToken, newEmail) => {
  return (dispatch) => {
    const payloadEmail = {
      idToken: idToken,
      email: newEmail,
      returnSecureToken: true
    }
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payloadEmail)
    .then(response => {
      console.log(response);
      dispatch(changeEmailAsync(response.data.idToken, response.data.email));
      alert('Your email has been successfully updated.');
    })
    .catch(err => {
      console.log(err);
    });
  }
}

export const changePasswordAsync = () => {
  return {

  }
}

export const changePassword = () => {
  return (dispatch) => {
    const payload = {
      requestType: 'PASSWORD_RESET',
      email: action.email
    }
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk").then(response => {
      console.log(response);
    }).catch(err => {
      console.log(err);
    });
  }
}
