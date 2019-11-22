import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class DeleteAccount extends React.Component {

  state = {
    deleteAccountChangeDivVisible: false
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

  render() {
    return (
      <div>
        <h3 onClick={this.showDeleteAccount}>DELETE ACCOUNT</h3><i class="fas fa-caret-down"></i>
        <div className={this.state.deleteAccountChangeDivVisible ? "visible change-account-setting" : "change-account-setting"} id="deleteAccount">
          <h3>Email:</h3>
          <input type="text"></input>
          <h3>Password:</h3>
          <input type="text"></input>
          <button>DELTE ACCOUNT</button>
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
    delteAccount: (todaysWeight) => dispatch({type: actionTypes.SET_TODAYS_WEIGHT, todaysWeight: todaysWeight})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccount);
