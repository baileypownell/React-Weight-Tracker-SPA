import React from 'react';
import Content from './Content';
import { Redirect } from 'react-router-dom'
import Program from './Program';

export default class CreateAccount extends React.Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: ''
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
    // then add the user to a user database, and not just authentication part of firebase
    const db = firebase.firestore();
    db.collection("users").add({
      first: this.state.firstName,
      last: this.state.lastName,
      email: this.state.email,
      password: this.state.password
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
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
