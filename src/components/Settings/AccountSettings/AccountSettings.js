import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import * as actions from '../../../store/actionCreators'
import { withRouter } from 'react-router-dom'
import M from 'materialize-css'
import './AccountSettings.scss'

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
    if (e.target.value.trim().length) {
      this.setState({
        [e.target.id]: e.target.value.trim()
      })
    }
  }

  deleteAccount = () => {
    let payload = {
      idToken: this.props.idToken
    }
    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${process.env.FIREBASE_API_KEY}`, payload)
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
    console.log(payloadEmail)
    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.FIREBASE_API_KEY}`, payloadEmail)
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
    axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.FIREBASE_API_KEY}`, payloadPassword)
    .then(response => {
      M.toast({html: 'Password link sent.'})
    })
    .catch(error => {
      console.log('Error: ', error.response.data.error)
      M.toast({html: 'There was an error.'})
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
                  <div className="input-field">
                    <input type="text" placeholder={this.props.firstName} id="newFirstName" onChange={this.handleChange}></input>
                    <label className="active" for="newFirstName">First Name</label>
                  </div>
                  <div className="input-field">
                    <input type="text" placeholder={this.props.lastName} id="newLastName" onChange={this.handleChange}></input>
                    <label className="active" for="newLastName">New Last Name</label>
                  </div>
                  <button className="waves-effect waves-light btn" onClick={this.updateName}>Submit</button>
                  </div>
              </li>
              <li>
                  <div className="collapsible-header">Update Email</div>
                  <div className="collapsible-body">
                    <div className="input-field">
                      <input id="newEmail" placeholder={this.props.email} onChange={this.handleChange} type="text"></input>
                      <label className="active" for="newEmail">New Email</label>
                    </div>
                    <button
                      className="waves-effect waves-light btn"
                      onClick={() => this.updateEmail(this.props.idToken, this.state.newEmail)}>
                      Submit
                    </button>
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
    email: state.user.email,
    lastName: state.user.lastName, 
    firstName: state.user.firstName
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
