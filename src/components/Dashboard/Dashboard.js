import React from 'react'
import { connect } from 'react-redux'
import RecentWeightLogs from './RecentWeightLogs/RecentWeightLogs'
import LineGraph from './LineGraph/LineGraph'
import WeightLogger from './WeightLogger/WeightLogger'
import './Dashboard.scss'
import { compare } from '../../compare'

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sortedWeights: [],
      loaded: false,
      todaysWeight: null
    }

    // This binding is necessary to make `this` work in the callback
    this.updateWeightHistory = this.updateWeightHistory.bind(this);
  }

  updateWeightHistory() {
    const db = firebase.firestore();
    db.collection("users").doc(this.props.localId).get()
    .then((doc) => {
      let weightHistory = doc.data().weights;
      let sortedAllWeightsRecorded = weightHistory.sort(compare)
      this.setState({
        sortedWeights: sortedAllWeightsRecorded,
        loaded: true,
      })
    })
    .catch(err => console.log(err))
  }

  componentDidMount() {
      this.updateWeightHistory(this.props.localId)
  }

  render() {
    const { sortedWeights, loaded, todaysWeight } = this.state;
    const { firstName } = this.props;

    return (
      <>
       { loaded ? 
        <div className="dashboard z-depth-15">
            <h4>Hello, {firstName}</h4>
            <WeightLogger 
              weights={sortedWeights} 
              todaysWeight={todaysWeight} 
              updateWeightHistory={this.updateWeightHistory}
            />
            <div id="account-options">
                <RecentWeightLogs 
                  weights={sortedWeights} 
                  todaysWeight={todaysWeight} /> 
                <LineGraph 
                  weights={sortedWeights} 
                  key={sortedWeights}  
                /> 
            </div>
        </div> 
      : null}
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    firstName: state.user.firstName,
    userLoggedIn: state.userLoggedIn,
    localId: state.localId,
  }
}

export default connect(mapStateToProps)(Dashboard);
