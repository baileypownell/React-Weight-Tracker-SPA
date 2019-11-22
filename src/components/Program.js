import React from 'react';
import Content from './Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';
import WeightHistory from './WeightHistory';

  let weightsArray;
  let todaysWeight;

class Program extends React.Component {

  // update redux with new weight
  handleChange = (e) => {
    todaysWeight = e.target.value;
  }

  logWeight = (e) => {
    e.preventDefault();
    // update redux with todays weight
    this.props.updateTodaysWeight(parseInt(todaysWeight));
    // then update firebase "users" database to hold today's new weight value
    let currentUser = this.props.firebaseAuthID;

    const db = firebase.firestore();
    db.collection("users").get().then((snapshot) => {
      for (let i = 0; i < snapshot.docs.length; i++) {
        if (snapshot.docs[i].data().firebaseAuthID == currentUser) {
          let userID = snapshot.docs[i].id;
          weightsArray = snapshot.docs[i].data().weights;
          let updatedWeights = weightsArray.concat({
            date: "now",
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

  render() {
    console.log(this.props.weightHistory);
    return (
      <Content>
        <h1 id="greeting">Hello, {this.props.firstName}</h1>
        <div id="weight-logger">
          <h2>Record Weight <i class="fas fa-pencil-alt"></i></h2>
          <form>
          <input onChange={this.handleChange} type="text"></input>
          <button onClick={this.logWeight}>LOG WEIGHT</button>
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
              {this.props.weightHistory ? <WeightHistory weightHistory={this.props.weightHistory}/> : <p>You haven't recorded a weight yet.</p>}
              <button>VIEW MORE</button>
            </div>

          </div>
          <div>
            <h2>Account Settings <i class="fas fa-cog"></i></h2>
            <div id="button-div">
              <button>CHANGE MY NAME</button>
              <button>CHANGE MY EMAIL</button>
              <button>CHANGE MY PASSWORD</button>
              <button>DELETE MY ACCOUNT</button>
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
