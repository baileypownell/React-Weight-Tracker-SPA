import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../store/actionCreators'
import { withRouter } from 'react-router-dom'
import M from 'materialize-css'
import './AccountSettings.scss'
import firebase from '../../../firebase-config'

class AccountSettings extends React.Component {

  state = {
    newFirstName: null,
    newLastName: null,
    newEmail: null,
  }

  logout = () => {
    this.props.logoutUser();
    this.props.history.push('/');
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
    const db = firebase.firestore();
      let uid = this.props.uid;
      db.collection("users").doc(uid).delete()
      .then((res) => {
        M.toast({html: 'Account successfully deleted.'})
          let user = this.props.user;
          user.delete()
        .then((res) => {
          this.props.deleteUser();
          this.props.history.push('/');
        })
        .catch((err) => {
          console.log(err)
        })
      })
      .catch((error) => {
        console.log(error);
      })
  }

  updateEmail = (newEmail) => {
    let user = firebase.auth().currentUser;
    user.updateEmail(newEmail)
    .then((res) => {
      const db = firebase.firestore();
      db.collection("users").doc(this.props.uid).set({
        email: newEmail
      }, { merge: true })
      M.toast({html: 'Email updated successfully.'});
    })
    .catch(err => {
      console.log(err)
      M.toast({html: 'There was an error.'})
    });
  }

  changeFirstName = () => {
    const db = firebase.firestore();
      db.collection("users").doc(this.props.uid).set({
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
        db.collection("users").doc(this.props.uid).set({
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
    firebase.auth().sendPasswordResetEmail(this.props.email)
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
      <div className="white-box" id="accountSettings">
        <div >
          <ul className="collapsible">
              <li>
                  <div className="collapsible-header">Update Name</div>
                  <div className="collapsible-body">
                  <div className="input-field">
                    <input type="text" placeholder={this.props.firstName} id="newFirstName" onChange={this.handleChange}></input>
                    <label className="active" htmlFor="newFirstName">First Name</label>
                  </div>
                  <div className="input-field">
                    <input type="text" placeholder={this.props.lastName} id="newLastName" onChange={this.handleChange}></input>
                    <label className="active" htmlFor="newLastName">New Last Name</label>
                  </div>
                  <button className="waves-effect waves-light btn" onClick={this.updateName}>Submit</button>
                  </div>
              </li>
              <li>
                  <div className="collapsible-header">Update Email</div>
                  <div className="collapsible-body">
                    <div className="input-field">
                      <input id="newEmail" placeholder={this.props.email} onChange={this.handleChange} type="text"></input>
                      <label className="active" htmlFor="newEmail">New Email</label>
                    </div>
                    <button
                      className="waves-effect waves-light btn"
                      onClick={() => this.updateEmail(this.state.newEmail)}>
                      Submit
                    </button>
                  </div>
              </li>
              <li>
                  <div className="collapsible-header">Update Password</div>
                  <div className="collapsible-body">
                      <p>Click the button below to receive an email with a link to reset your password. You will be automatically logged out after clicking the button, and will need to re-authenticate.</p>
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
    uid: state.uid,
    email: state.user.email,
    lastName: state.user.lastName, 
    firstName: state.user.firstName
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteUser: () => dispatch(actions.deleteUser()),
    logoutUser: () => dispatch(actions.logoutUserAsync()),
    changeEmail: (newEmail) => dispatch(actions.changeEmail(newEmail)),
    changeFirstName: (firstName) => dispatch(actions.changeFirstName(firstName)),
    changeLastName: (lastName) => dispatch(actions.changeLastName(lastName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountSettings));
