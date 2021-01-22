import firebase from 'firebase';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: "weight-tracker-91762",
    storageBucket: "weight-tracker-91762.appspot.com",
    messagingSenderId: process.env.MESSAGE_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig)
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('User Identified.')
    } 
  });

export default firebase