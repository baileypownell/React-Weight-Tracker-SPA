import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../store/actionCreators'
import { withRouter } from 'react-router-dom'
import firebase from '../../firebase-config'

class CreateAccount extends React.Component {
  state = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    firebaseAuthID: '',
    weights: [],
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  componentDidMount() { }

  handleSubmit = (e) => {
    e.preventDefault();
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
    .then(response => {
      let email = response.user.email;
      let uid = response.user.uid;

      const db = firebase.firestore();
      db.collection("users").doc(uid).set({
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        email: this.state.email,
        firebaseAuthID: uid,
        weights: [],
        goals: []
      })
      .then((res) => {
          // then update redux by logging in and creating account
          this.props.createAccount(this.state.firstName, this.state.lastName, email, uid);
          this.props.history.push('/dashboard');
      })
      .catch(err => console.log(err))
    })
    .catch((error) => {
      console.log(error)
      M.toast({html: error.message})
    });
   }

  render() {
    const { firstName, lastName, email, password } = this.state
    return (
      <div id="mobile-center">
        <div className="content-parent">
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

              <button disabled={!firstName || !lastName || !email || !password} className="waves-effect waves-light btn">Sign Up</button>
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
    createAccount: (firstName, lastName, email, uid) => dispatch(actions.createAccount(firstName, lastName, email, uid)),
    logout: () => dispatch(actions.logoutUser())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateAccount));
