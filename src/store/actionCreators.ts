
import { getAuth, signOut } from 'firebase/auth'
import { doc, getDoc, getFirestore } from 'firebase/firestore'
import firebase from '../firebase-config'
import * as actionTypes from './actionTypes'

export const createAccount = (firstName: string, lastName: string, email: string, uid: string) => {
  return {
    type: actionTypes.CREATE_ACCOUNT,
    email: email,
    firstName: firstName,
    lastName: lastName,
    firebaseAuthID: uid,
    uid: uid,
  }
}

export const loginUser = (email: string, uid: string) => {
  return {
    type: actionTypes.SET_USER_LOGGED_IN,
    email: email,
    uid: uid,
  }
}

export const setUserData = (firstName: string, lastName: string) => {
  return {
    type: actionTypes.SET_USER_DATA,
    firstName: firstName,
    lastName: lastName,
  }
}

export const getUserDataAsync = (uid: string) => {
  return async (dispatch, getState) => {

    let firstName, lastName;
    const db = getFirestore(firebase);

    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      firstName = docSnap.data().firstName;
      lastName = docSnap.data().lastName;
      dispatch(setUserData(firstName, lastName));
    }
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

export const logoutUserAsync = () => {
  return dispatch => {
    signOut(getAuth()).then(() => {
      dispatch(logoutUser());
    }).catch((err) => {
      console.log('There has been an error logging the user out of Firebase: ', err)
    });
  }
}

export const changeFirstName = (firstName: string) => {
  return {
    type: actionTypes.CHANGE_FIRST_NAME,
    firstName: firstName
  }
}

export const changeLastName = (lastName: string) => {
  return {
    type: actionTypes.CHANGE_LAST_NAME,
    lastName: lastName
  }
}

export const changeEmail = (newEmail: string) => {
  return {
    type: actionTypes.CHANGE_EMAIL,
    newEmail: newEmail,
  }
}
