import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../store/actionCreators'
import M from 'materialize-css'
import { withRouter } from 'react-router-dom'
import './Login.scss'
import Button from '@material-ui/core/Button'
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
    const { email, password, authError } = this.state
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
          <Button 
            disabled={!email || !password} 
            color="primary"
            type="submit"
            variant="contained">
              Log In
            </Button>
        </form>
        {authError ? 
          <div style={{ padding: '10px 0'}}>
            <p>Forgot password? Receive a link to reset your password.</p>
            <Button 
              id="send-link"
              variant="outlined"
              onClick={this.sendPasswordResetEmail}>
                Send link 
              <i class="fas fa-envelope"></i>
            </Button>
          </div>
          : null
        }
        <div id="no-account">
          <p>Don't have an account?</p>
          <Button  
            onClick={this.createAccount} 
            variant="outlined"
            color="secondary">
            Sign Up 
            <i className="fas fa-arrow-alt-circle-right"></i>
          </Button>
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
