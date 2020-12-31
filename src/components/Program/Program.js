import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RecentWeightLogs from './RecentWeightLogs/RecentWeightLogs';
import LineGraph from './LineGraph/LineGraph';
import WeightLogger from './WeightLogger/WeightLogger';
import './Program.scss';
import { compare } from '../../compare'

class Program extends React.Component {

  state = {
    sortedWeights: null
  }

  componentDidMount() {
      const db = firebase.firestore();
      db.collection("users").doc(this.props.localId).get()
      .then((doc) => {
        let weightHistory = doc.data().weights;
        let sortedAllWeightsRecorded = weightHistory.sort(compare)
        this.setState({
          sortedWeights: sortedAllWeightsRecorded
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <>
        { this.props.userLoggedIn ?
          <div className="dashboard z-depth-15">
              <h4>Hello, {this.props.firstName}</h4>
              <WeightLogger/>
              <div id="account-options">
                {
                  this.state.sortedWeights ? 
                  <>
                      <RecentWeightLogs weights={this.state.sortedWeights} todaysWeight={this.props.todaysWeight} /> 
                      <LineGraph weights={this.state.sortedWeights} /> 
                  </> : null
                }
                
              </div>
          </div> 
          : 
          <Redirect to="/login" />
        }
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    firstName: state.user.firstName,
    todaysWeight: state.todaysWeight,
    userLoggedIn: state.userLoggedIn,
    localId: state.localId
  }
}

export default connect(mapStateToProps)(Program);
