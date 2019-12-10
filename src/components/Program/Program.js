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

  let weightsArray;
  let todaysWeight;

class Program extends React.Component {

  state = {
    formInputEmpty: true
  }

  // update redux with new weight
  handleChange = (e) => {
    todaysWeight = e.target.value;
    if (document.querySelector("#weight-logger form input").value.length > 1) {
      this.setState({
        formInputEmpty: false
      });
    } else {
      this.setState({
        formInputEmpty: true
      });
    }
  }

  logWeight = (e) => {
    e.preventDefault();
    if (document.querySelector("#weight-logger form input").value.length > 1) {
      // update redux with todays weight
      this.props.updateTodaysWeight(parseInt(todaysWeight));
      //update redux weightHistory with todays weight

      // then update firebase "users" database to hold today's new weight value
      let currentUser = this.props.firebaseAuthID;

      const db = firebase.firestore();
      db.collection("users").get().then((snapshot) => {
        for (let i = 0; i < snapshot.docs.length; i++) {
          if (snapshot.docs[i].data().firebaseAuthID == currentUser) {
            let date = new Date();
            let userID = snapshot.docs[i].id;
            weightsArray = snapshot.docs[i].data().weights;
            let updatedWeights = weightsArray.concat({
              date: {date},
              weight: this.props.todaysWeight});
            db.collection("users").doc(userID).update({
               weights: updatedWeights
           })
           // empty the input form
           document.querySelector("#weight-logger form input").value = '';
           return;
          }
        }
      })
    }
   }


  render() {
    return (
      <Content>
        <h1 id="greeting">Hello, {this.props.firstName}</h1>
        <div id="weight-logger">
          <h2>Record Weight <i class="fas fa-pencil-alt"></i></h2>
          <form>
          <input onChange={this.handleChange} type="text"></input>
          <button onClick={this.logWeight} className={this.state.formInputEmpty ? "button-disabled" : null}>LOG WEIGHT</button>
          </form>
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
              {this.props.weightHistory ? <WeightHistory  todaysWeight={todaysWeight}/> : <p>You haven't recorded a weight yet.</p>}
            </div>

          </div>
          <div>
            <h2>Account Settings <i class="fas fa-cog"></i></h2>
            <div id="button-div">
              // <ChangeName/>
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
    weightHistory: state.weightHistory
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateTodaysWeight: (todaysWeight) => dispatch({type: actionTypes.SET_TODAYS_WEIGHT, todaysWeight: todaysWeight})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Program);
