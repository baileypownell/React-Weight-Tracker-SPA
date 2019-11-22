import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class ChangeName extends React.Component {

  state = {
    nameChangeDivVisible: false
  }

  showChangeName = () => {
    if (this.state.nameChangeDivVisible) {
      this.setState({
        nameChangeDivVisible: false
      })
    } else {
      this.setState({
        nameChangeDivVisible: true
      })
    }
  }

  render() {
    return (
      <div>
        <h3 onClick={this.showChangeName}>CHANGE MY NAME</h3><i class="fas fa-caret-down"></i>
        <div className={this.state.nameChangeDivVisible ? "visible change-account-setting" : "change-account-setting"} id="nameChange">
          <h3>New first name:</h3>
          <input type="text"></input>
          <h3>New last name:</h3>
          <input type="text"></input>
          <button>SUBMIT</button>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    firstName: state.user.firstName,
    lastName: state.user.lastname
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeName: (todaysWeight) => dispatch({type: actionTypes.SET_TODAYS_WEIGHT, todaysWeight: todaysWeight})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeName);
