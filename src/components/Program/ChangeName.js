import React from 'react';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actions from '../../store/actionCreators';

class ChangeName extends React.Component {

  state = {
    nameChangeDivVisible: false,
    firstName: '',
    lastName: '',
    firstNameUpdated: false,
    lastNameUpdated: false
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

  changeFirstName = () => {
    if (this.state.firstName !== ' ' && this.state.firstName.length > 0) {
      // update "users" database
      const db = firebase.firestore();
        db.collection("users").doc(this.props.localId).set({
          firstName: this.state.firstName
        }, { merge: true });
      //update Redux
      this.props.changeFirstName(this.state.firstName);
      this.setState({
        firstNameUpdated: true
      })
    }
  }

  changeLastName = () => {
    if (this.state.lastName!== ' ' && this.state.lastName.length > 0) {
      // update "users" database
      const db = firebase.firestore();
        db.collection("users").doc(this.props.localId).set({
          lastName: this.state.lastName
        }, { merge: true });
      //update Redux
      this.props.changeLastName(this.state.lastName);
      this.setState({
        lastNameUpdated: true
      })
    }
  }

  render() {

    return (
      <div>
        <h3 onClick={this.showChangeName}>UPDATE NAME</h3><i className={this.state.nameChangeDivVisible ? "fas fa-caret-up" : "fas fa-caret-down"}></i>
        <div className={this.state.nameChangeDivVisible ? "visible change-account-setting" : "change-account-setting"} id="nameChange">
          <h3>New first name:</h3>
          <input type="text" id="firstName" onChange={this.handleChange}></input>
          {this.state.firstNameUpdated ? <h3>Your first name has been changed to: {this.props.firstName}</h3> : null}
          <button onClick={this.changeFirstName}>SUBMIT</button>
          <h3>New last name:</h3>
          <input type="text" id="lastName" onChange={this.handleChange}></input>
          {this.state.lastNameUpdated ? <h3>Your last name has been changed to: {this.props.lastName}</h3> : null}
          <button onClick={this.changeLastName}>SUBMIT</button>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => {
  return {
    firstName: state.user.firstName,
    lastName: state.user.lastName,
    localId: state.localId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeFirstName: (firstName) => dispatch(actions.changeFirstName(firstName)),
    changeLastName: (lastName) => dispatch(actions.changeLastName(lastName))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChangeName);
