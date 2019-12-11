import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../../store/actionCreators';

class DeleteAccount extends React.Component {

  state = {
    deleteAccountChangeDivVisible: false,
    confirmationDivVisible: false
  }

  showDeleteAccount = () => {
    if (this.state.deleteAccountChangeDivVisible) {
      this.setState({
        deleteAccountChangeDivVisible: false
      })
    } else {
      this.setState({
        deleteAccountChangeDivVisible: true
      })
    }
  }

  confirm = () => {
    this.setState({
      confirmationDivVisible: true
    })
  }

  reverseConfirm = () => {
    this.setState({
      confirmationDivVisible: false
    })
  }


  deleteAccount = () => {
    let payload = {
      idToken: this.props.idToken
    }
    axios.post("https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyBa2yI5F5kpQTAJAyACoxkA5UyCfaEM7Pk", payload)
    .then(response => {
      console.log(response);
      // then delete account in "users" database
      const db = firebase.firestore();
      let localId = this.props.localId;
        db.collection("users").doc(localId).delete().then(() => {
          console.log('user deleted');
        }).catch((error) => {
          console.log('Error: ', error.response.data.error);
        })
      // then clear Redux
      this.props.deleteUser();
      // redirect
      this.props.history.push('/');
    })
    .catch(error => {
      console.log('Error: ', error.response.data.error);
    });
  }

  render() {
    let confirmationModal = (
      <div id="confirmationModal">
        <h1>Are you sure you want to delete your account?</h1>
        <div>
          <button onClick={this.deleteAccount}>YES</button>
          <button onClick={this.reverseConfirm}>NO</button>
        </div>
      </div>
    )
    return (
      <div>
        <h3 onClick={this.showDeleteAccount}>DELETE ACCOUNT</h3><i className={this.state.deleteAccountChangeDivVisible ? "fas fa-caret-up" : "fas fa-caret-down"}></i>
        <div className={this.state.deleteAccountChangeDivVisible ? "visible change-account-setting" : "change-account-setting"} id="deleteAccount">
          <button onClick={this.confirm}>DELTE ACCOUNT</button>
        </div>
        {this.state.confirmationDivVisible ? confirmationModal : null}
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    idToken: state.idToken,
    localId: state.localId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteUser: () => dispatch(actions.deleteUser())
  }
}

export default connect(mapStateToProps)(DeleteAccount);
