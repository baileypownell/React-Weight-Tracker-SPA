import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class ChangeEmail extends React.Component {

  state = {
    emailChangeDivVisible: false,
    newEmail: ''
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

  render() {
    return (
      <div>
        <h3 onClick={this.showChangeEmail}>CHANGE MY EMAIL</h3><i class="fas fa-caret-down"></i>
        <div className={this.state.emailChangeDivVisible ? "visible change-account-setting" : "change-account-setting"} id="emailChange">
          <h3>New Email:</h3>
          <input onChange={this.setNewEmail} type="text"></input>
          <button onClick={() => this.props.changeEmail(localStorage.token, this.state.newEmail)}>SUBMIT</button>
      </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    email: state.user.email,
    idToken: localStorage.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeEmail: (idToken, newEmail) => dispatch({type: actionTypes.CHANGE_EMAIL, idToken: idToken, newEmail: newEmail})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
