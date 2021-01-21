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
      goals: null,
      primaryGoal: null,
    }

    // This binding is necessary to make `this` work in the callback
    this.updateWeightHistory = this.updateWeightHistory.bind(this);
  }

  updateWeightHistory() {
    const db = firebase.firestore();
    db.collection("users").doc(this.props.uid).get()
    .then((doc) => {
      let weightHistory = doc.data().weights;
      let sortedAllWeightsRecorded = weightHistory.sort(compare)
      let sortedGoals = doc.data().goals.sort(compareGoals)
      const lastWeight = sortedAllWeightsRecorded[0].weight
      determineGoalStatus(sortedGoals, lastWeight, this.props.uid)
      .then((res) => {
        if (res.updatedGoals) {
          let futureGoals = res.updatedGoals.filter(goal => !goal.complete && !goal.incomplete)
          this.setState({
            sortedWeights: sortedAllWeightsRecorded,
            loaded: true,
            goals: res.updatedGoals,
            primaryGoal: futureGoals[0]
          })
        } else {
          let futureGoals = sortedGoals.filter(goal => !goal.complete && !goal.incomplete)
          this.setState({
            sortedWeights: sortedAllWeightsRecorded,
            loaded: true,
            goals: sortedGoals,
            primaryGoal: futureGoals[0]
          })
        }
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
  }

  componentDidMount() {
      this.updateWeightHistory(this.props.uid)
  }

  render() {
    const { sortedWeights, loaded, goals, primaryGoal } = this.state;
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
                primaryGoal ? 
                  <GoalNotifier primaryGoal={primaryGoal}
                    />
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
    uid: state.uid,
  }
}

export default connect(mapStateToProps)(Dashboard);
