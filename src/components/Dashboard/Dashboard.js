import React from 'react'
import { connect } from 'react-redux'
import RecentWeightLogs from './RecentWeightLogs/RecentWeightLogs'
import LineGraph from './LineGraph/LineGraph'
import WeightLogger from './WeightLogger/WeightLogger'
import './Program.scss'
import { compare } from '../../compare'

class Dashboard extends React.Component {

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
        { this.state.sortedWeights ?
          <div className="dashboard z-depth-15">
              <h4>Hello, {this.props.firstName}</h4>
              <WeightLogger/>
              <div id="account-options">
                  <RecentWeightLogs weights={this.state.sortedWeights} todaysWeight={this.props.todaysWeight} /> 
                  <LineGraph weights={this.state.sortedWeights} /> 
              </div>
          </div> : null
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

export default connect(mapStateToProps)(Dashboard);
