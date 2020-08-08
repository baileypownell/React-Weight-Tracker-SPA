import React from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../../../store/actionCreators';
import { withRouter } from 'react-router-dom';
import M from 'materialize-css';
import './AccountSettings.scss';

class AccountSettings extends React.Component {

  state = {
    newFirstName: null,
    newLastName: null,
    newEmail: null,
  }

  componentDidMount() {
    var elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems, {});
  }
  
  handleChange = (e) => {
    if (e.target.value.trim() !== '') {
      this.setState({
        [e.target.id]: e.target.value.trim()
      })
    }
  }

  deleteAccount = () => {
    let payload = {
      idToken: this.props.idToken
    }
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payload)
    .then(response => {
      const db = firebase.firestore();
      let localId = this.props.localId;
        db.collection("users").doc(localId).delete()
        .then(() => {
          M.toast({html: 'Account successfully deleted.'})
          this.props.deleteUser();
          this.props.history.push('/');
        })
        .catch((error) => {
          console.log('Error: ', error.response.data.error);
          M.toast({html: 'There was an error.'})
        })
    })
    .catch(error => {
      M.toast({html: 'There was an error.'});
      console.log('Error: ', error.response.data.error);
    });
  }

  updateEmail = (idToken, newEmail) => {
    const payloadEmail = {
      idToken: idToken,
      email: newEmail,
      returnSecureToken: true
    }
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payloadEmail)
    .then(response => {
      this.props.changeEmail(idToken, newEmail);
      const db = firebase.firestore();
        db.collection("users").doc(this.props.localId).set({
          email: newEmail
        }, { merge: true })
        M.toast({html: 'Email updated successfully.'});
    })
    .catch(err => {
      console.log(err);
      M.toast({html: 'There was an error.'});
    });
  }

  changeFirstName = () => {
    const db = firebase.firestore();
      db.collection("users").doc(this.props.localId).set({
        firstName: this.state.newFirstName
      }, { merge: true })
      .then(() => {
        M.toast({html: 'First name updated.'})
      })
      .catch((err) => {
        console.log(err);
        M.toast({html: 'First name could not be updated.'})
      });
    this.props.changeFirstName(this.state.newFirstName);
  }

  changeLastName = () => {
      // update "users" database
      const db = firebase.firestore();
        db.collection("users").doc(this.props.localId).set({
          lastName: this.state.newLastName
        }, { merge: true })
        .then(() => {
          M.toast({html: 'Last name updated.'})
        })
        .catch((err) => {
          console.log(err);
          M.toast({html: 'Last name could not be updated.'})
        });
      //update Redux
      this.props.changeLastName(this.state.newLastName);
  }

  updateName = () => {
    if (this.state.newFirstName) {
      this.changeFirstName()
    }
    if (this.state.newLastName) {
      this.changeLastName()
    }
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
      M.toast({html: 'Password link sent.'});
    })
    .catch(error => {
      console.log('Error: ', error.response.data.error);
      M.toast({html: 'There was an error.'});
    });
  }
  
  render() {
    return (
      <div className="white-box" id="accountSettings">
        <h6>Account Settings</h6>
        <div >
          <ul className="collapsible">
                <li>
                  <div className="collapsible-header">Update Name</div>
                  <div className="collapsible-body">
                      <p>New first name</p>
                      <input type="text" id="newFirstName" onChange={this.handleChange}></input>
                      <p>New last name</p>
                      <input type="text" id="newLastName" onChange={this.handleChange}></input>
                      <button className="waves-effect waves-light btn" onClick={this.updateName}>Submit</button>
                  </div>
                </li>
                <li>
                  <div className="collapsible-header">Update Email</div>
                  <div className="collapsible-body">
                      <p>New Email</p>
                      <input id="newEmail" onChange={this.handleChange} type="text"></input>
                      <button
                        className="waves-effect waves-light btn"
                        onClick={() => this.updateEmail(this.props.idToken, this.state.newEmail)}>Submit</button>
                  </div>
                </li>
                <li>
                  <div className="collapsible-header">Update Password</div>
                  <div className="collapsible-body">
                      <p>Click the button below to receive an email with a link to reset your password.</p>
                      <button className="waves-effect waves-light btn" onClick={this.changePassword}>Email my link</button>
                  </div>
                </li>
                <li>
                  <div className="collapsible-header">Delete Account</div>
                  <div className="collapsible-body">
                        <p>This action cannot be undone.</p>
                        <button className="waves-effect waves-light btn" onClick={this.deleteAccount}>Delete Account</button>
                  </div>
                </li>
              </ul>
        </div>
      </div>
    )
  }
  
}

const mapStateToProps = state => {
  return {
    idToken: state.idToken,
    localId: state.localId,
    email: state.user.email
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteUser: () => dispatch(actions.deleteUser()),
    changeEmail: (idToken, newEmail) => dispatch(actions.changeEmail(idToken, newEmail)),
    changeFirstName: (firstName) => dispatch(actions.changeFirstName(firstName)),
    changeLastName: (lastName) => dispatch(actions.changeLastName(lastName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountSettings));
