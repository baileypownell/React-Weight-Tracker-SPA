import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import axios from 'axios';

class ChangePassword extends React.Component {

  state = {
    passwordChangeDivVisible: false,
    newPassword: '',
    passwordEmailSent: false,
    passwordResetError: false,
    passwordResetErrorMessage: ''
  }

  showChangePassword = () => {
    if (this.state.passwordChangeDivVisible) {
      this.setState({
        passwordChangeDivVisible: false
      })
    } else {
      this.setState({
        passwordChangeDivVisible: true
      })
    }
  }

  setNewPassword = (e) => {
    this.setState({
      newPassword: e.target.value
    })
  }

  changePassword = () => {
    const payloadPassword = {
      requestType: 'PASSWORD_RESET',
      email: this.props.email
    }
    console.log(payloadPassword)
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payloadPassword)
    .then(response => {
      console.log(response);
      this.setState({
        passwordEmailSent: true
      })
    })
    .catch(error => {
      console.log('Error: ', error.response.data.error);
      this.setState({
        passwordResetError: true,
        passwordResetErrorMessage: error.response.data.error
      })
    });
  }

  render() {
    return (
      <div>
        <h3 onClick={this.showChangePassword}>CHANGE MY PASSWORD</h3><i className={this.state.passwordChangeDivVisible ? "fas fa-caret-up" : "fas fa-caret-down"}></i>
        <div className={this.state.passwordChangeDivVisible ? "visible change-account-setting" : "change-account-setting"} id="passwordChange">
          <h3>Click the button below to receive an email with a link to reset your password.</h3>
          <button onClick={this.changePassword}>RESET PASSWORD</button>
          {this.state.passwordEmailSent ? <h3 className="result">Check your email for a link to reset your password.</h3> : null}
          {this.state.passwordResetError ? <h3 className="result">{this.state.passwordResetErrorMessage}</h3> : null}
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    idToken: state.idToken,
    email: state.user.email
  }
}

export default connect(mapStateToProps)(ChangePassword);
