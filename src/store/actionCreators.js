
import * as actionTypes from './actionTypes'
import firebase from '../firebase-config'

export const createAccount = (firstName, lastName, email, uid) => {
  return {
    type: actionTypes.CREATE_ACCOUNT,
    email: email,
    firstName: firstName,
    lastName: lastName,
    firebaseAuthID: uid,
    uid: uid,
  }
}

export const loginUser = (email, uid) => {
  return {
    type: actionTypes.SET_USER_LOGGED_IN,
    email: email,
    uid: uid,
  }
}

export const setUserData = (firstName, lastName) => {
  return {
    type: actionTypes.SET_USER_DATA,
    firstName: firstName,
    lastName: lastName,
  }
}

// thunk action creator
export const getUserDataAsync = (uid) => {
  return (dispatch, getState) => {
    // grab current state
    const state = getState();
    let firstName, lastName, weightHistory;
    // based on the localId, which is the firebaseAuthID property in the "users" database, get information specific to the user
    const db = firebase.firestore();
    db.collection("users").doc(uid).get().then((doc) => {
      if (doc.exists) {
        firstName = doc.data().firstName;
        lastName = doc.data().lastName;
        // now update Redux
        dispatch(setUserData(firstName, lastName));
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

export const deleteUser = () => {
  return {
    type: actionTypes.DELETE_USER
  }
}

//thunk
export const logoutUserAsync = () => {
  return dispatch => {
    firebase.auth().signOut().then(() => {
      // change redux state
      dispatch(logoutUser());
    }).catch((err) => {
      console.log('There has been an error logging the user out of Firebase: ', err)
    });
  }
}

export const changeFirstName = (firstName) => {
  return {
    type: actionTypes.CHANGE_FIRST_NAME,
    firstName: firstName
  }
}

export const changeLastName = (lastName) => {
  return {
    type: actionTypes.CHANGE_LAST_NAME,
    lastName: lastName
  }
}


export const changeEmail = (newEmail) => {
  return {
    type: actionTypes.CHANGE_EMAIL,
    newEmail: newEmail,
  }
}
