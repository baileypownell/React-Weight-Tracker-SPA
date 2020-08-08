import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import axios from 'axios';
import * as actions from '../../../../store/actionCreators';
import { withRouter } from 'react-router-dom';

class DeleteAccount extends React.Component {

  state = {
    confirmationDivVisible: false
  }

  toggleDelete = () => {
    this.setState(prevState => ({
      confirmationDivVisible: !prevState.confirmationDivVisible
    }))
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
          //console.log('user deleted');
        }).catch((error) => {
          console.log('Error: ', error.response.data.error);
        })
    })
    .catch(error => {
      console.log('Error: ', error.response.data.error);
    });
    // then clear Redux
    this.props.deleteUser();
    // redirect
    this.props.history.push('/');
  }

  render() {
    let confirmationModal = (
      <div id="confirmationModal">
        <h1>Are you sure you want to delete your account?</h1>
        <div>
          <button onClick={this.deleteAccount}>YES</button>
          <button onClick={this.toggleDelete}>NO</button>
        </div>
      </div>
    )
    return (
      <div>

          <button className="waves-effect waves-light btn" id="deleteAccount" onClick={this.toggleDelete}>DELETE ACCOUNT</button>

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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(DeleteAccount));
