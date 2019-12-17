import React from 'react';

import Content from '../Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actions from '../../store/actionCreators';

import RecentWeightLogs from './RecentWeightLogs/RecentWeightLogs';
import AccountSettings from './AccountSettings/AccountSettings';
import LineGraph from './LineGraph/LineGraph';

import './Program.scss';

class Program extends React.Component {

  state = {
    formInputEmpty: true,
    todaysWeight: 0,
    errorMessage: false,
    editorVisible: false,
    weightUpdated: false
  }

  // update redux with new weight
  handleChange = (e) => {
    if (document.querySelector("#weight-logger form input").value.length > 1) {
      this.setState({
        formInputEmpty: false,
        todaysWeight: e.target.value
      });
    } else {
      this.setState({
        formInputEmpty: true
      });
    }
  }

  handleUpdateChange = (e) => {
    if (document.querySelector("#editModal input").value.length > 1) {
      this.setState({
        todaysWeight: e.target.value
      });
    }
  }

  logWeight = (e) => {
    e.preventDefault();
    // there needs to be a check to see if there has been a weight entered in the past 24 hours... redux todaysWeight should be set from database and only allowed to be updated if null
    if (this.state.todaysWeight > 0 && !this.props.todaysWeight) {
      let weightHistory;
      // update redux with todays weight
      this.props.updateTodaysWeight(parseInt(this.state.todaysWeight));
      // then update firebase "users" database to hold today's new weight value
      const db = firebase.firestore();
      db.collection("users").doc(this.props.localId).get().then((doc) => {
        weightHistory = doc.data().weights;
        let date = new Date();
        let updatedWeights = weightHistory.concat({
          date: {date},
          weight: this.state.todaysWeight});
        db.collection("users").doc(this.props.localId).update({
          weights: updatedWeights});
        })
      .catch(err => {
        console.log(err)
      })
      document.querySelector("#weight-logger form input").value = '';
      return;
    } else {
      this.setState(prevState => ({
        errorMessage: !prevState.errorMessage
      }));
    }
    }

  toggleEditor = (e) => {
    e.preventDefault();
    this.setState(prevState => ({
      editorVisible: !prevState.editorVisible
    }))
  }

  updateTodaysWeight = () => {
    if (document.querySelector("#editModal input").value.length < 1) {
      return;
    } else {
      // update redux
      this.props.updateTodaysWeight(parseInt(this.state.todaysWeight));
      this.setState(prevState => ({
        weightUpdated: !prevState.weightUpdated
      }))
      // update firebase "users" database to hold today's new weight value
      const db = firebase.firestore();
      db.collection("users").doc(this.props.localId).get().then((doc) => {
        let weightHistory = doc.data().weights;
        // delete last item
        weightHistory.pop();
        let date = new Date();
        let updatedWeights = weightHistory.concat({
          date: {date},
          weight: this.state.todaysWeight});
        db.collection("users").doc(this.props.localId).update({
          weights: updatedWeights});
        })
      .catch(err => {
        console.log(err)
      })
      document.querySelector("#editModal input").value = '';
    }
  }


  render() {
    let editor = (
      <div id="editModal">
        <i onClick={this.toggleEditor} className="fas fa-times-circle"></i>
        <h1>Update today's weight:</h1>
        <div>
          <input onChange={this.handleUpdateChange} type="text"></input>
          <button onClick={this.updateTodaysWeight}>UPDATE</button>
        </div>
        {this.state.weightUpdated ? <h2>Your weight has been updated to: {this.props.todaysWeight} lbs.</h2> : null}
      </div>
    )
    return (
      <Content>
        <h1 id="greeting">Hello, {this.props.firstName}</h1>
        <div id="weight-logger">
          <h2>Record Weight <i className="fas fa-pencil-alt"></i></h2>
          <form>
          <input onChange={this.handleChange} type="text"></input>
          <div>
            <button onClick={this.logWeight} className={this.state.formInputEmpty || this.props.todaysWeight > 0 ? "button-disabled" : null}>LOG WEIGHT</button>
            <button onClick={this.props.todaysWeight ? this.toggleEditor : undefined} className={this.props.todaysWeight > 0 ? null : "button-disabled"}>Edit today's weight</button>
          </div>
          </form>
          {this.state.editorVisible ? editor : null}
          {this.props.todaysWeight ? <h2>Today's Weight: {this.props.todaysWeight} lbs.</h2> : null }
        </div>
        <div id="account-options">
          <RecentWeightLogs/>
          <LineGraph/>
          <AccountSettings/>
        </div>
      </Content>
    )
  }
}

const mapStateToProps = state => {
  return {
    firstName: state.user.firstName,
    lastName: state.user.lastname,
    email: state.user.email,
    password: state.user.password,
    firebaseAuthID: state.user.firebaseAuthID,
    todaysWeight: state.todaysWeight,
    userLoggedIn: state.userLoggedIn,
    localId: state.localId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateTodaysWeight: (todaysWeight) => dispatch(actions.setTodaysWeight(todaysWeight))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Program);
