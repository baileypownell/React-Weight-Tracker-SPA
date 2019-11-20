import React from 'react';
import Content from './Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';

  let weightsArray;
  let todaysWeight;

class Program extends React.Component {

  // update redux with new weight
  handleChange = (e) => {
    todaysWeight = e.target.value;
    console.log(todaysWeight);
  }

  logWeight = (e) => {
    e.preventDefault();
    // update redux with todays weight
    this.props.updateTodaysWeight(parseInt(todaysWeight));
    console.log(this.props.todaysWeight);
    // get current user from redux eventually; this will be the firebaseAuthID
    let currentUser = firebase.auth().currentUser;
    // add the number to the user database
    const db = firebase.firestore();
    db.collection("users").get().then((snapshot) => {
      for (let i = 0; i < snapshot.docs.length; i++) {
        if (snapshot.docs[i].data().firebaseAuthID == currentUser.uid) {
          weightsArray = snapshot.docs[i].data().weights;

          let updatedWeights = weightsArray.concat(this.props.todaysWeight);
          console.log(updatedWeights);
          db.collection("users").doc('CQ450NanETchc6YR41Uw').update({
             weights: updatedWeights
         })
          return;
        }
      }
    })
   }

  render() {
    return (
      <Content>
        <h1>Hello, {this.props.firstName}</h1>
        <div id="weight-logger">
          <h2>Record Weight <i class="fas fa-pencil-alt"></i></h2>
          <form>
          <input onChange={this.handleChange} type="text"></input>
          <button onClick={this.logWeight}>LOG WEIGHT</button>
          </form>
        </div>
        <div id="account-options">
          <div>
            <h2>Recent Weight Logs <i class="fas fa-history"></i></h2>
            <button>VIEW MY ENTIRE HISTORY</button>
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
    todaysWeight: state.todaysWeight,
    userLoggedIn: state.userLoggedIn
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateTodaysWeight: (todaysWeight) => dispatch({type: actionTypes.SET_TODAYS_WEIGHT, todaysWeight: todaysWeight})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Program);
