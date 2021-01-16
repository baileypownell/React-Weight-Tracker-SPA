import React from 'react'
import { connect } from 'react-redux'
import RecentWeightLogs from './RecentWeightLogs/RecentWeightLogs'
import LineGraph from './LineGraph/LineGraph'
import WeightLogger from './WeightLogger/WeightLogger'
import Goal from '../Goal/Goal'
import GoalNotifier from '../GoalNotifier/GoalNotifier'
import './Dashboard.scss'
import { compare, compareGoals } from '../../compare'
import { determineGoalStatus } from '../../determine-goal-status'
import { calculateTodaysWeight } from '../../calculate-todays-weight'

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sortedWeights: [],
      loaded: false, 
      goals: null
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
      let sortedGoals = doc.data().goals.sort(compareGoals)
      const lastWeight = sortedAllWeightsRecorded[0].weight
      //sortedGoals.map(goal => 
      determineGoalStatus(sortedGoals, lastWeight, this.props.localId)
      .then((res) => {
        console.log(res)
        if (res.updatedGoals) {
          this.setState({
            sortedWeights: sortedAllWeightsRecorded,
            loaded: true,
            goals: res.updatedGoals
          })
        } else {
          this.setState({
            sortedWeights: sortedAllWeightsRecorded,
            loaded: true,
            goals: sortedGoals
          })
        }
      })
      .catch(err => console.log(err))
      
      // this.setState({
      //   sortedWeights: sortedAllWeightsRecorded,
      //   loaded: true,
      //   goals: sortedGoals
      // })
    })
    .catch(err => console.log(err))
  }

  componentDidMount() {
      this.updateWeightHistory(this.props.localId)
  }

  render() {
    const { sortedWeights, loaded, goals } = this.state;
    const todaysWeight = calculateTodaysWeight(this.state.sortedWeights)

    return (
        <div className="dashboard z-depth-15">
          { loaded ? 
            <div className="dashboard-content">
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
                  { sortedWeights.length ? 
                    <LineGraph 
                      weights={sortedWeights} 
                    /> 
                  : null}
                  
              </div>
              <Goal 
                key={goals}
                updateGoals={this.updateWeightHistory} 
                goals={goals} 
                weights={sortedWeights} 
              />
              {
                goals[0] ? 
                  <GoalNotifier 
                    primaryGoal={goals[0]}/>
                : null
              }
            </div>
             : 
             <div id="center">
                <div className="preloader-wrapper big active">
                <div className="spinner-layer ">
                  <div className="circle-clipper left">
                    <div className="circle"></div>
                  </div>
                  <div className="gap-patch">
                    <div className="circle"></div>
                  </div>
                  <div className="circle-clipper right">
                    <div className="circle"></div>
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
