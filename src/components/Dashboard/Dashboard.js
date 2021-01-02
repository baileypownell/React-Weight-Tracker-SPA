import React from 'react'
import { connect } from 'react-redux'
import RecentWeightLogs from './RecentWeightLogs/RecentWeightLogs'
import LineGraph from './LineGraph/LineGraph'
import WeightLogger from './WeightLogger/WeightLogger'
import './Dashboard.scss'
import { compare } from '../../compare'
import { calculateTodaysWeight } from '../../calculate-todays-weight'

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sortedWeights: [],
      loaded: false
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
    const { sortedWeights, loaded } = this.state;
    const todaysWeight = calculateTodaysWeight(this.state.sortedWeights)

    return (
        <div className="dashboard z-depth-15">
          { loaded ? 
            <>
              <h4 id="dashboard">Dashboard</h4>
              <WeightLogger 
                weights={sortedWeights} 
                todaysWeight={todaysWeight}
                updateWeightHistory={this.updateWeightHistory}
              />
              <div id="account-options">
                  <RecentWeightLogs 
                    weights={sortedWeights} 
                  /> 
                  <LineGraph 
                    weights={sortedWeights} 
                    key={sortedWeights}  
                  /> 
              </div>
            </>
             : 
             <div id="center">
                <div class="preloader-wrapper big active">
                <div class="spinner-layer ">
                  <div class="circle-clipper left">
                    <div class="circle"></div>
                  </div><div class="gap-patch">
                    <div class="circle"></div>
                  </div><div class="circle-clipper right">
                    <div class="circle"></div>
                  </div>
                </div>
              </div>
            </div>}
        </div> 
    )
  }
}

const mapStateToProps = state => {
  return {
    userLoggedIn: state.userLoggedIn,
    localId: state.localId,
  }
}

export default connect(mapStateToProps)(Dashboard);
