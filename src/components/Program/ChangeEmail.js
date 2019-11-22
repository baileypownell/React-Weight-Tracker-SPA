import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class ChangeEmail extends React.Component {

  state = {
    emailChangeDivVisible: false
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
          <input type="text"></input>
          <button>SUBMIT</button>
      </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    email: state.user.email
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeEmail: (todaysWeight) => dispatch({type: actionTypes.SET_TODAYS_WEIGHT, todaysWeight: todaysWeight})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
