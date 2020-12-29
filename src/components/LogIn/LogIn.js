import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../store/actionCreators';
import axios from 'axios';
import './Login.scss';
import M from 'materialize-css';

import { withRouter } from 'react-router-dom';

class LogIn extends React.Component {

  state = {
    email: '',
    password: '',
    authError: null,
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
      console.log(response.data.expiresIn);
      //update Redux state
      let email = response.data.email;
      let expiresIn = response.data.expiresIn;
      let idToken = response.data.idToken;
      let localId = response.data.localId;
      let refreshToken = response.data.refreshToken;
      this.props.login(email, expiresIn, idToken, localId, refreshToken);
      this.props.getUserData(localId);
      this.props.history.replace('/dashboard');
    })
    .catch((error) => {
      console.log('Error: ', error.response.data.error);
      this.setState({
        authError: true
      })
      let errorMessage = error.response.data.error.message
      let messageToUser = '';
      if (errorMessage === 'INVALID_EMAIL') {
        messageToUser = 'The email is invalid.';
      } else if (errorMessage === 'EMAIL_NOT_FOUND') {
        messageToUser = 'There is no account associated with this email.';
      } else if (errorMessage === 'INVALID_PASSWORD') {
        messageToUser = 'The password is invalid';
      } else if (errorMessage === 'USER_DISABLED') {
        messageToUser = 'The user has been disabled.';
      } else if (errorMessage === 'OPERATION_NOT_ALLOWED') {
        messageToUser = 'Password sign-in is disabled for this project.';
      } else if (errorMessage === 'USER_NOT_FOUND') {
        messageToUser = 'There is no user record corresponding to this identifier. The user may have been deleted.';
      } else if (errorMessage.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
        messageToUser = "You've entered your password incorrectly too many times. Wait before trying to re-authenticate."
      } else {
        messageToUser = "There has been an error."
      }
      M.toast({html: messageToUser})
    });
  }

  sendPasswordResetEmail = () => {
    const payloadPassword = {
      requestType: 'PASSWORD_RESET',
      email: this.state.email
    }
    console.log(payloadPassword)
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payloadPassword)
    .then(response => {
      console.log(response);
      M.toast({html: 'Link sent successfully.'})
    })
    .catch(error => {
      console.log('Error: ', error.response.data.error);
      if (error.response.data.error.message == 'EMAIL_NOT_FOUND') {
        M.toast({html: 'There is no account for the provided email.'})
      } else {
        M.toast({html: 'There was an error.'})
      }
    });
  }

  render() {
    return (
      <div className="login">
        <h4>Log In</h4>
        <form onSubmit={this.handleSubmit}>
              <label>Email
              <input placeholder="Email" id="email" type="email" onChange={this.handleChange} ></input>
              </label>
              <label>Password
              <input placeholder="Password" id="password" type="password" onChange={this.handleChange} ></input>
              </label>
          <button className="waves-effect waves-light btn">log in</button>
        </form>
        {this.state.authError ? 
          <div>
            <p>Forgot password? Receive a link to reset your password</p>
            <button className="waves-effect waves-light btn" onClick={this.sendPasswordResetEmail}>Send link</button>
          </div>
          : null
        }
      </div>
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
