import React from 'react';
import Content from './Content';
import { Redirect } from 'react-router-dom'
import Program from './Program/Program';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';
import { withRouter } from 'react-router-dom';


class CreateAccount extends React.Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    firebaseAuthID: '',
    weights: []
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }
  handleSubmit = (e) => {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      // connect firebase Auth to user database
      let currentUser = firebase.auth().currentUser;
      let uid = currentUser.uid;
      //let userFirstName, userLastName, userEmail, userPassword, firebaseAuthID;
      const db = firebase.firestore();
      db.collection("users").add({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        firebaseAuthID: uid,
        weights: []
      })
      .then(function(docRef) {
          //console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
          console.error("Error adding document: ", error);
      });
      this.props.setLoginStatusTrue(this.state.firstName, this.state.lastName, this.state.email, this.state.password, uid);
      this.props.history.replace('/Program')
    })
    .catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode) {
        console.log(errorCode);
        if (errorCode === 'auth/invalid-email') {
          alert('Your password is invalid.');
        }
        if (errorCode === 'auth/email-already-in-use') {
          alert('An account already exists for that email.');
        }
      }
      if (errorMessage) {
        console.log(errorMessage);
      }
    });
   }
  render() {
    return (
      <Content>
        <h1>CREATE AN ACCOUNT</h1>
        <form onSubmit={this.handleSubmit}>
          <label><h2>First Name:</h2></label>
          <input type="text" name="first_name" id="firstName" onChange={this.handleChange}>
          </input>
          <label><h2>Last Name:</h2></label>
          <input type="text" name="last_name" id="lastName" onChange={this.handleChange}>
          </input>
          <label><h2>Email:</h2></label>
          <input type="email" name="email" id="email" onChange={this.handleChange}>
          </input>
          <label><h2>Password:</h2></label>
          <input type="text" name="password" id="password" onChange={this.handleChange}>
          </input>
          <button>SIGN UP <i class="fas fa-arrow-circle-right"></i></button>
        </form>
      </Content>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoginStatusTrue: (firstName, lastName, email, password, firebaseAuthID) => dispatch({type: actionTypes.SET_USER_LOGGED_IN, firstName: firstName, lastName: lastName, email: email, password: password, firebaseAuthID: firebaseAuthID})
  }
}

export default connect(null, mapDispatchToProps)(withRouter(CreateAccount));
