import React from 'react';
import Content from './Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';


import { withRouter } from 'react-router-dom';

class LogIn extends React.Component {
  state = {
    email: '',
    password: ''
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      // reach out to firebase, get the UIID for the given email, find the first name associated with the given email in the "users" database, and update redux state to store that first name
      let userFirstName, userLastName, userEmail, userPassword, firebaseAuthID, weightHistory;
      let currentUser = firebase.auth().currentUser;
      let uid = currentUser.uid;
      // connect to firebase database "users"
      const db = firebase.firestore();
      db.collection("users").get().then((snapshot) => {
        for (let i = 0; i < snapshot.docs.length; i++) {
          if (snapshot.docs[i].data().firebaseAuthID == uid) {
            console.log("snapshot" + snapshot.docs[i].data());
            userFirstName = snapshot.docs[i].data().firstName;
            userLastName = snapshot.docs[i].data().lastName;
            userEmail = snapshot.docs[i].data().email;
            userPassword = snapshot.docs[i].data().password;
            firebaseAuthID = snapshot.docs[i].data().firebaseAuthID;
            weightHistory = snapshot.docs[i].data().weights;
            this.props.setLoginStatusTrue(userFirstName, userLastName, userEmail, userPassword, firebaseAuthID, weightHistory);
            console.log(localStorage.token, localStorage.userId)
            this.props.setUserTokenAndID(localStorage.token, localStorage.userId);
            this.props.history.replace('/Program');
            return;
          }
        }
       }
    );
    })
    .catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode) {
        console.log('Error code: ' + errorCode);
      }
      if (errorMessage) {
        console.log('Error message: ' + errorMessage);
      }
    });
  }

  render() {
    return (
      <Content>
        <h1>LOG IN</h1>
        <form onSubmit={this.handleSubmit}>
          <label><h2>Email:</h2></label>
          <input type="email" name="email" id="email" onChange={this.handleChange}>
          </input>
          <label><h2>Password:</h2></label>
          <input type="password" name="password" id="password" onChange={this.handleChange}>
          </input>
          <button>LOG IN <i class="fas fa-arrow-circle-right"></i></button>
        </form>
      </Content>
    )
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setLoginStatusTrue: (firstName, lastName, email, password, firebaseAuthID, weightHistory) => dispatch({type: actionTypes.SET_USER_LOGGED_IN, firstName: firstName, lastName: lastName, email: email, password: password, firebaseAuthID: firebaseAuthID, weightHistory: weightHistory}),
    setUserTokenAndID: (idToken, userId) => dispatch({type: actionTypes.SET_USER_TOKEN_AND_ID, idToken: idToken, userId: userId})
  }
}

export default connect(null, mapDispatchToProps)(withRouter(LogIn));
