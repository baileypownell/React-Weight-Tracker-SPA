import React from 'react';
import Content from './Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';

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
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
    .then(() => {
      // reach out to firebase, grab the first name associated with the given email, and update redux state to store that first name
      let userFirstName;
      const db = firebase.firestore();
      db.collection("users").get().then((snapshot) => {
        for (let i = 0; i < snapshot.docs.length; i++) {
          if (snapshot.docs[i].id == 'UAJouKdspzQMhNkO4VbaZlQi2OE2') {
              //console.log(snapshot.docs[i].data().firstName);
              userFirstName = snapshot.docs[i].data().firstName;

              this.props.setUserFirstName(userFirstName);

          }
        }
      });

      this.props.setLoginStatusTrue();
      this.props.history.replace('/Program');
    })
    .catch(function(error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode) {
        console.log(errorCode);
      }
      if (errorMessage) {
        console.log(errorMessage);
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
          <input type="text" name="password" id="password" onChange={this.handleChange}>
          </input>
          <button>LOG IN <i class="fas fa-arrow-circle-right"></i></button>
        </form>
      </Content>
    )
  }
}


const mapDispatchToProps = dispatch => {
  return {
    setUserFirstName: (firstName) => dispatch({type: actionTypes.SET_USER_FIRST_NAME, firstName: firstName}),
    setLoginStatusTrue: () => dispatch({type: actionTypes.SET_USER_LOGGED_IN})
  }
}

export default connect(null, mapDispatchToProps)(LogIn);
