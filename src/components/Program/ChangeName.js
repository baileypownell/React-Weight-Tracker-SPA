import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actions from '../../store/actionCreators';

class ChangeName extends React.Component {

  state = {
    nameChangeDivVisible: false,
    firstName: '',
    lastName: ''
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
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

  // changeName = () => {
  //   // update "users" database
  //   const db = firebase.firestore();
  //     db.collection("users").doc('"' + this.props.localId + '"').set({
  //       firstName: this.state.firstName,
  //       lastName: this.state.lastName
  //     })
  //   //update Redux
  //   this.props.changeName(this.state.firstName, this.state.lastName);
  // }

  render() {
    return (
      <div>
        <h3 onClick={this.showChangeName}>CHANGE MY NAME</h3><i class="fas fa-caret-down"></i>
        <div className={this.state.nameChangeDivVisible ? "visible change-account-setting" : "change-account-setting"} id="nameChange">
          <h3>New first name:</h3>
          <input type="text" onChange={this.handleChange}></input>
          <h3>New last name:</h3>
          <input type="text" onChange={this.handleChange}></input>
          <button >SUBMIT</button>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    firstName: state.user.firstName,
    lastName: state.user.lastname,
    localId: state.localId
  }
}

// const mapDispatchToProps = dispatch => {
//   return {
//     changeName: (firstName, lastName) => dispatch(actions.changeName(firstName, lastName))
//   }
// }

export default connect(mapStateToProps)(ChangeName);
