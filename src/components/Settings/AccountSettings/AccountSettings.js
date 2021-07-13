import React from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../store/actionCreators'
import { withRouter } from 'react-router-dom'
import M from 'materialize-css'
import './AccountSettings.scss'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import firebase from '../../../firebase-config'

class AccountSettings extends React.Component {

  state = {
    newFirstName: null,
    newLastName: null,
    newEmail: null,
    showUserConfirmationModal: false
  }

  logout = () => {
    this.props.logoutUser();
    this.props.history.push('/');
  }

  componentDidMount() {
    const elems = document.querySelectorAll('.collapsible')
    M.Collapsible.init(elems, {})
  }
  
  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value.trim()
    })
  }

  deleteAccount = () => {
    const db = firebase.firestore()
    let uid = this.props.uid;
    db.collection("users").doc(uid).delete()
    .then((res) => {
        let user = this.props.user
        user.delete()
      .then((res) => {
        this.props.deleteUser()
        M.toast({html: 'Account successfully deleted.'})
        this.props.history.push('/')
      })
      .catch((err) => {
        console.log(err)
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }


  updateEmail = () => {
    const newEmail = this.state.newEmail
    let user = firebase.auth().currentUser;
    user.updateEmail(newEmail)
    .then((res) => {
      const db = firebase.firestore();
      db.collection("users").doc(this.props.uid).set({
        email: newEmail
      }, { merge: true })
      M.toast({html: 'Email updated successfully.'})
      this.setState({
        newEmail: ''
      })
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
    const { newEmail, showUserConfirmationModal, newFirstName, newLastName } = this.state;

    return (
      <div className="white-box" id="accountSettings">

        <Dialog aria-labelledby="simple-dialog-title" open={showUserConfirmationModal}>
            <DialogTitle id="simple-dialog-title">Confirm Deletion</DialogTitle>
            <DialogContent>
                <DialogContentText>
                  Are you sure you want to delete your account? This action is irreversible.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button 
                variant="outlined" 
                autoFocus
                onClick={() => this.setState({showUserConfirmationModal: false})}>
                No
            </Button>
            <Button 
                variant="outlined"  
                id="warning-btn"
                onClick={this.deleteAccount}>
                Yes, delete my account
            </Button>
            </DialogActions>
        </Dialog>


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
                  <Button variant="outlined" disabled={!newLastName && !newFirstName} color="secondary" onClick={this.updateName}>Submit</Button>
                  </div>
              </li>
              <li>
                  <div className="collapsible-header">Update Email</div>
                  <div className="collapsible-body">
                    <div className="input-field">
                      <input id="newEmail" placeholder={this.props.email} onChange={this.handleChange} type="text"></input>
                      <label className="active" htmlFor="newEmail">New Email</label>
                    </div>
                    <Button
                      color="secondary"
                      variant="outlined"
                      disabled={!newEmail}
                      onClick={this.updateEmail}>
                      Submit
                    </Button>
                  </div>
              </li>
              <li>
                  <div className="collapsible-header">Update Password</div>
                  <div className="collapsible-body">
                      <p>Click the button below to receive an email with a link to reset your password.</p>
                      <Button variant="outlined" color="secondary" onClick={this.changePassword}>Email my link</Button>
                  </div>
                </li>
                <li>
                  <div className="collapsible-header">Delete Account</div>
                  <div className="collapsible-body">
                      <p>This action cannot be undone.</p>
                      <Button 
                        variant="outlined"
                        color="secondary"
                        id="warning-btn"
                        onClick={() => this.setState({ showUserConfirmationModal: true })}
                        >
                        Delete Account
                      </Button>
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
