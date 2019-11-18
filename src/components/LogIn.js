import React from 'react';
import Content from './Content';


export default class LogIn extends React.Component {
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
