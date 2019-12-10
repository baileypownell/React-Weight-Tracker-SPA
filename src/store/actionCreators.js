import axios from 'axios';
import * as actionTypes from './actionTypes';

export const createAccount = (firstName, lastName, email, localId, expiresIn, idToken, refreshToken) => {
  return {
    type: actionTypes.CREATE_ACCOUNT,
    email: email,
    firstName: firstName,
    lastName: lastName,
    firebaseAuthID: localId,
    expiresIn: expiresIn,
    idToken: idToken,
    localId: localId,
    refreshToken: refreshToken
  }
}

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
    db.collection("users").doc(localId).get().then((doc) => {
      if (doc.exists) {
       console.log("Document data:", doc.data());
       firstName = doc.data().firstName;
       lastName = doc.data().lastName;
       weightHistory = doc.data().weights;
       // now update Redux
       dispatch(setUserData(firstName, lastName, weightHistory));
       // return;
       } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
       }
    }).catch((error) => {
      console.log(error);
    })
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

// export const changeName = (firstName, lastName) => {
//   return {
//     type: actionTypes.CHANGE_NAME,
//     firstName: action.firstName,
//     lastName: action.lastName
//   }
// }



export const changeEmail = (idToken, newEmail) => {
  return {
    type: actionTypes.CHANGE_EMAIL,
    newEmail: newEmail,
    idToken: idToken
  }
}

// redux-thunk in action = using dispatch as a return value, and only when request has resolved do we dispatch an action itself. Then, wherever we need to call the async function in our project, we use mapDispatchToProps to call the async function with the required parameters
export const changeEmailAsync = (idToken, newEmail) => {
  return (dispatch) => {
    const payloadEmail = {
      idToken: idToken,
      email: newEmail,
      returnSecureToken: true
    }
    console.log('Payload = ', payloadEmail)
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payloadEmail)
    .then(response => {
      console.log(response);
      //dispatch(changeEmail(idToken, newEmail));
      alert('Your email has been successfully updated to:', response.data.email);
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
