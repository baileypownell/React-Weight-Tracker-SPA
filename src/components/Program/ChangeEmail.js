import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actions from '../../store/actionCreators';
import axios from 'axios';


class ChangeEmail extends React.Component {

  state = {
    emailChangeDivVisible: false,
    newEmail: '',
    success: false
  }

  setNewEmail = (e) => {
    this.setState({
      newEmail: e.target.value
    })
  }

  showChangeEmail = () => {
    if (this.state.emailChangeDivVisible) {
      this.setState({
        emailChangeDivVisible: false
      })
    } else {
      this.setState({
        emailChangeDivVisible: true
      })
    }
  }

  updateEmail = (idToken, newEmail) => {
    // first, update email in firebase authentication
    const payloadEmail = {
      idToken: idToken,
      email: newEmail,
      returnSecureToken: true
    }
    console.log('Payload = ', payloadEmail)
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payloadEmail)
    .then(response => {
      console.log('Response from axios post request: ', response);
      console.log('Response from axios post request: ', response.data.email);
      // then, update Redux
      this.props.changeEmail(idToken, newEmail);
      this.setState({
        success: true
      });
      // finally, update "users" database
      const db = firebase.firestore();
        db.collection("users").doc(this.props.localId).set({
          email: newEmail
        }, { merge: true })
    })
    .catch(err => {
      console.log(err);
    });
  }

  render() {
    return (
      <div>
        <h3 onClick={this.showChangeEmail}>CHANGE MY EMAIL</h3><i class="fas fa-caret-down"></i>
        <div
          className={this.state.emailChangeDivVisible ? "visible change-account-setting" : "change-account-setting"}
          id="emailChange">
          <h3>New Email:</h3>
          <input onChange={this.setNewEmail} type="text"></input>
          <button
            onClick={() => this.updateEmail(this.props.idToken, this.state.newEmail)}>SUBMIT</button>
          {this.state.success ? <h3 className="result">Your email has been updated successfully to: {this.state.newEmail} </h3>: null}
      </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    email: state.user.email,
    idToken: state.idToken,
    localId: state.localId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeEmail: (idToken, newEmail) => dispatch(actions.changeEmail(idToken, newEmail))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
