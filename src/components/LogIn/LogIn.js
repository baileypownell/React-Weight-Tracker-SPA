import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../store/actionCreators'
import M from 'materialize-css'
import { withRouter } from 'react-router-dom'
import './Login.scss'

import firebase from '../../firebase-config'


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
    e.preventDefault()
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then((response) => {
      let email = response.user.email;
      let uid = response.user.uid;
      this.props.login(email, uid);
      this.props.getUserData(uid);
      this.props.history.replace('/dashboard');
    })
    .catch((err) => {
      console.log(err)
      this.setState({
        authError: true
      })
      M.toast({html: err.message})
    })
  }

  createAccount = () => {
    this.props.history.replace('/signup');
  }

  sendPasswordResetEmail = () => {
    firebase.auth().sendPasswordResetEmail(this.state.email)
    .then(() => {
      M.toast({ html: 'Password reset email sent.'})
    })
    .catch((err) => {
      console.log(err) 
      M.toast({ html: 'There was an error.' })
    });
  }

  render() {
    return (
      <div id="mobile-center">
        <div className="content-parent">
        <h4>Log In</h4>
        <form id="login" onSubmit={this.handleSubmit}>
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
        <div id="no-account">
          <p>Don't have an account?</p>
          <button  onClick={this.createAccount} className="waves-effect waves-light btn">Sign Up <i className="fas fa-arrow-alt-circle-right"></i></button>
        </div>
      </div>
      </div>
    )
  }
}



const mapDispatchToProps = dispatch => {
  return {
    login: (email, uid) => dispatch(actions.loginUser(email, uid)),
    getUserData: (uid) => dispatch(actions.getUserDataAsync(uid))
  }
}

export default connect(null, mapDispatchToProps)(withRouter(LogIn));
