import React from 'react';
import Content from './Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../store/actionTypes';
import * as actions from '../store/actionCreators';
import axios from 'axios';

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
    login: (email, expiresIn, idToken, localId, refreshToken) => dispatch(actions.loginUser(email, expiresIn, idToken, localId, refreshToken)),
    getUserData: (localId) => dispatch(actions.getUserDataAsync(localId))
  }
}

export default connect(null, mapDispatchToProps)(withRouter(LogIn));
