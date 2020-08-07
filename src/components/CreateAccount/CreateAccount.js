import React from 'react';
import Content from '../Content/Content';
import { Redirect } from 'react-router-dom'
import Program from '../Program/Program';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actions from '../../store/actionCreators';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

class CreateAccount extends React.Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    firebaseAuthID: '',
    weights: [],
    errorMessage: ''
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  // log out the user if they reach this page and are signed in already
  componentDidMount() {
    if (this.props.userLoggedIn) {
      this.props.logout();
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email: this.state.email,
      password: this.state.password,
      returnSecureToken: true
    }
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payload)
    .then(response => {
      console.log(response);
      //update Redux state
      let email = response.data.email;
      let expiresIn = response.data.expiresIn;
      let idToken = response.data.idToken;
      let localId = response.data.localId;
      let refreshToken = response.data.refreshToken;

      const db = firebase.firestore();
        db.collection("users").doc(localId).set({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          email: this.state.email,
          firebaseAuthID: localId,
          weights: []
        })
      // then update redux by logging in and creating account
      this.props.createAccount(this.state.firstName, this.state.lastName, email, localId, expiresIn, idToken, refreshToken);
      this.props.history.replace('/dashboard');
    })
    .catch((error) => {
      console.log('Error: ', error.response.data.error);
      this.setState((prevState) => ({
        errorMessage: error.response.data.error.message
      }))
    });
   }

  render() {
    let errorMessage = null;
    if (this.state.errorMessage) {
      let messageToUser = '';
      if (this.state.errorMessage === 'INVALID_EMAIL') {
        messageToUser = 'The email is invalid.';
      } else if (this.state.errorMessage === 'INVALID_PASSWORD') {
        messageToUser = 'The password is invalid';
      } else if (this.state.errorMessage === 'EMAIL_EXISTS') {
        messageToUser = 'The email address is already in use by another account.';
      } else if (this.state.errorMessage === 'WEAK_PASSWORD') {
        messageToUser = 'The password must be 6 characters long or more.';
      } else {
        messageToUser = "There has been an error."
      }
      errorMessage = (
        <h3>{messageToUser}</h3>
      )
    }
    return (
      <div className="login">
        <h4>Create an Account</h4>
        <form onSubmit={this.handleSubmit}>
              <label>
                  First Name
                <input id="firstName" placeholder="First Name" type="text" onChange={this.handleChange}></input>
              </label>
              <label>
                  Last Name
                  <input id="lastName" placeholder="Last Name" type="test" type="text" onChange={this.handleChange}></input>
              </label>
              <label >
                  Email
                  <input type="email" placeholder="Email" name="email" id="email" onChange={this.handleChange}>
                  </input>
               </label>
              <label>
                  Password
                  <input placeholder="Password" type="password" name="password" id="password" onChange={this.handleChange}>
              </input>
              </label>

            <button className="waves-effect waves-light btn">Sign Up</button>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userLoggedIn: state.userLoggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createAccount: (firstName, lastName, email, localId, expiresIn, idToken, refreshToken) => dispatch(actions.createAccount(firstName, lastName, email, localId, expiresIn, idToken, refreshToken)),
    logout: () => dispatch(actions.logoutUser())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateAccount));
