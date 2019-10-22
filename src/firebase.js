import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk",
  authDomain: "weight-tracker-91762.firebaseapp.com",
  databaseURL: "https://weight-tracker-91762.firebaseio.com",
  storageBucket: "weight-tracker-91762.appspot.com",
  messagingSenderId: "325881243868",
};

const firebase = firebase.initializeApp(config);
export default firebase;
// We are now ready to use Firebase Database, Auth, and Storage in our front-end app
