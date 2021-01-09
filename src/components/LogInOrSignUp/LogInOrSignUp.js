import React from 'react';
import './LogInOrSignUp.scss';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../store/actionCreators';
import { withRouter } from 'react-router-dom';


class LogInOrSignUp extends React.Component {

  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    firebaseAuthID: '',
    weights: [],
    authError: false
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  login = (e) => {
    e.preventDefault();
    let payload = {
      email: this.state.email,
      password: this.state.password,
      returnSecureToken: true
    }
    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`, payload)
    .then(response => {
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

  signup = (e) => {
    e.preventDefault();
    const payload = {
      email: this.state.email,
      password: this.state.password,
      returnSecureToken: true
    }
    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`, payload)
    .then(response => {
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
          weights: [],
          goals: []
        })
      // then update redux by logging in and creating account
      this.props.createAccount(this.state.firstName, this.state.lastName, email, localId, expiresIn, idToken, refreshToken);
      this.props.history.replace('/dashboard');
    })
    .catch((error) => {
      console.log('Error: ', error.response.data.error);
      let errorMessage = error.response.data.error.message;
        let messageToUser = '';
        if (errorMessage === 'INVALID_EMAIL') {
          messageToUser = 'The email is invalid.';
        } else if (errorMessage === 'INVALID_PASSWORD') {
          messageToUser = 'The password is invalid';
        } else if (errorMessage === 'EMAIL_EXISTS') {
          messageToUser = 'The email address is already in use by another account.';
        } else if (errorMessage === 'WEAK_PASSWORD') {
          messageToUser = 'The password must be 6 characters long or more.';
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
    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.FIREBASE_API_KEY}`, payloadPassword)
    .then(response => {
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
      <div className="content-parent">
        <div>
          <h4>Log In</h4>
          <form onSubmit={this.login}>
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
        <div id="OR">
        <h2>OR</h2>
        </div>
        <div>
          <h4>Create an Account</h4>
          <form onSubmit={this.signup}>
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
    logout: () => dispatch(actions.logoutUser()),
    login: (email, expiresIn, idToken, localId, refreshToken) => dispatch(actions.loginUser(email, expiresIn, idToken, localId, refreshToken)),
    getUserData: (localId) => dispatch(actions.getUserDataAsync(localId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LogInOrSignUp));
