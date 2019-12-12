import React from 'react';

import Content from '../Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actionTypes';
import WeightHistory from './WeightHistory';
import ChangeName from './ChangeName';
import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import DeleteAccount from './DeleteAccount';

class Program extends React.Component {

  state = {
    formInputEmpty: true,
    todaysWeight: 0,
    errorMessage: false,
    editorVisible: false,
    weightUpdated: false,
    latestData: null
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
    if (this.state.todaysWeight > 0 && !this.props.todaysWeight) {
      let weightHistory;
      // update redux with todays weight
      this.props.updateTodaysWeight(parseInt(this.state.todaysWeight));
      // then update firebase "users" database to hold today's new weight value
      const db = firebase.firestore();
      // first store the current weights in an array...
      db.collection("users").doc(this.props.localId).get().then((doc) => {
        weightHistory = doc.data().weights;
        let date = new Date();
        let updatedWeights = weightHistory.concat({
          date: {date},
          weight: this.props.todaysWeight});
        db.collection("users").doc(this.props.localId).update({
          weights: updatedWeights});
      })
      .catch(err => {
        console.log(err)
      });
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
    // update redux
    this.props.updateTodaysWeight(parseInt(this.state.todaysWeight));
    // then update firebase "users" database to hold today's new weight value
    const db = firebase.firestore();
    db.collection("users").doc(this.props.localId).get().then((doc) => {
      let weightHistory = doc.data().weights;
      // delete last item
      weightHistory.pop();
      let date = new Date();
      let updatedWeights = weightHistory.concat({
        date: {date},
        weight: this.props.todaysWeight});
      db.collection("users").doc(this.props.localId).update({
        weights: updatedWeights});
    })
    .catch(err => {
      console.log(err)
    })
    .then(() => {
      // then make the API call again and pass the result to WeightHistory as props
      db.collection("users").doc(this.props.localId).get().then((doc) => {
        console.log(doc.data().weights);
        this.setState({
          latestData: doc.data().weights
        })
      });
    });
    document.querySelector("#editModal input").value = '';
    this.setState(prevState => ({
      weightUpdated: !prevState.weightUpdated
    }))
    return;
  }


  render() {
    let editor = (
      <div id="editModal">
        <i onClick={this.toggleEditor} class="fas fa-times-circle"></i>
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
          <h2>Record Weight <i class="fas fa-pencil-alt"></i></h2>
          <form>
          <input onChange={this.handleChange} type="text"></input>
          <div>
            <button onClick={this.logWeight} className={this.state.formInputEmpty || this.props.todaysWeight > 0 ? "button-disabled" : null}>LOG WEIGHT</button>
            <button onClick={this.toggleEditor}>Edit today's weight</button>
          </div>
          </form>
          {this.state.editorVisible ? editor : null}
          {this.props.todaysWeight ? <h2>Today's Weight: {this.props.todaysWeight} lbs.</h2> : null }
        </div>
        <div id="account-options">
          <div>
            <h2>Recent Weight Logs <i class="fas fa-history"></i></h2>
            <div id="weight-history">
              <div id="header">
                <span>Weight</span>
                <span>Date</span>
              </div>
              {this.props.weightHistory ? <WeightHistory latestData={this.state.latestData}/> : <p>You haven't recorded a weight yet.</p>}
            </div>

          </div>
          <div>
            <h2>Account Settings <i class="fas fa-cog"></i></h2>
            <div id="button-div">
              <ChangeName/>
              <ChangeEmail/>
              <ChangePassword/>
              <DeleteAccount/>
            </div>
          </div>
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
    weightHistory: state.weightHistory,
    localId: state.localId
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateTodaysWeight: (todaysWeight) => dispatch({type: actionTypes.SET_TODAYS_WEIGHT, todaysWeight: todaysWeight})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Program);
