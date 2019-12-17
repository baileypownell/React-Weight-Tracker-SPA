import React from 'react';
import Content from '../Content/Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actionTypes';
import * as actions from '../../store/actionCreators';
import axios from 'axios';

import { withRouter } from 'react-router-dom';

class LogIn extends React.Component {
  state = {
    email: '',
    password: '',
    errorMessage: ''
  }
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }


  handleSubmit = (e) => {
    e.preventDefault();
    let payload = {
      email: this.state.email,
      password: this.state.password,
      returnSecureToken: true
    }
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payload)
    .then(response => {
      console.log(response);
      //update Redux state
      let email = response.data.email;
      let expiresIn = response.data.expiresIn;
      let idToken = response.data.idToken;
      let localId = response.data.localId;
      let refreshToken = response.data.refreshToken;
      this.props.login(email, expiresIn, idToken, localId, refreshToken);
      this.props.getUserData(localId);
      this.props.history.replace('/Program');
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
      } else if (this.state.errorMessage === 'EMAIL_NOT_FOUND') {
        messageToUser = 'There is no account associated with this email.';
      } else if (this.state.errorMessage === 'INVALID_PASSWORD') {
        messageToUser = 'The password is invalid';
      } else if (this.state.errorMessage === 'USER_DISABLED') {
        messageToUser = 'The user has been disabled.';
      } else if (this.state.errorMessage === 'OPERATION_NOT_ALLOWED') {
        messageToUser = 'Password sign-in is disabled for this project.';
      } else if (this.state.errorMessage === 'USER_NOT_FOUND') {
        messageToUser = 'There is no user record corresponding to this identifier. The user may have been deleted.';
      } else if (this.state.errorMessage === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
        mesageToUser = "You've entered your password incorrectly too many times. Wait before trying to re-authenticate."
      } else {
        messageToUser = "There has been an error."
      }
      errorMessage = (
        <h3>{messageToUser}</h3>
      )
    }

    return (
      <Content>
        <h2>LOG IN</h2>
        <form onSubmit={this.handleSubmit}>
          <label><h3>Email:</h3></label>
          <input type="email" name="email" id="email" onChange={this.handleChange}>
          </input>
          <label><h3>Password:</h3></label>
          <input type="password" name="password" id="password" onChange={this.handleChange}>
          </input>
          <button>LOG IN <i class="fas fa-arrow-circle-right"></i></button>
        </form>
        {errorMessage}
      </Content>
    )
  }
}



const mapDispatchToProps = dispatch => {
  return {
    login: (email, expiresIn, idToken, localId, refreshToken) => dispatch(actions.loginUser(email, expiresIn, idToken, localId, refreshToken)),
    getUserData: (localId) => dispatch(actions.getUserDataAsync(localId))
  }
}

export default connect(null, mapDispatchToProps)(withRouter(LogIn));
