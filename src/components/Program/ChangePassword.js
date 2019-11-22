import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class ChangePassword extends React.Component {

  state = {
    passwordChangeDivVisible: false
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

  render() {
    return (
      <div>
        <h3 onClick={this.showChangePassword}>CHANGE MY PASSWORD</h3><i class="fas fa-caret-down"></i>
        <div className={this.state.passwordChangeDivVisible ? "visible change-account-setting" : "change-account-setting"} id="passwordChange">
          <h3>New Password:</h3>
          <input type="text"></input>
          <button>SUBMIT</button>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    password: state.user.password
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changePassword: (todaysWeight) => dispatch({type: actionTypes.SET_TODAYS_WEIGHT, todaysWeight: todaysWeight})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
