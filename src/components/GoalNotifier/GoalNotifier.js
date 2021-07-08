
import React from 'react'
import M from 'materialize-css'
import { connect } from 'react-redux'
import './GoalNotifier.scss'
var { DateTime } = require('luxon')

let instance

class GoalNotifier extends React.Component {

    state = {
        daysLeft: ''
    }

    componentDidMount() {   
        var elem = document.querySelector('.tap-target')
        instance = M.TapTarget.init(elem, {})
        instance.open()

        let now = new Date()
        let nowDate = DateTime.fromISO(now.toISOString())
        let targetDate = DateTime.fromISO((new Date(this.props.primaryGoal.goalTargetUnix * 1000).toISOString()))
        let daysLeft = targetDate.diff(nowDate, 'days').values.days
        this.setState({
            daysLeft: daysLeft
        })
     }

     closeNotifier() {
        instance.close()
     }

    render() {

        const { daysLeft } = this.state;
        const { primaryGoal } = this.props;

        return (
            <div>
                <a id="menu" ></a>
                <div className="tap-target" data-target="menu">
                    <div className="tap-target-content">
                        <div class="goal-content">
                            { daysLeft >= 1 ? 
                                <>
                                    <h5>Your next goal of {primaryGoal.goalWeight} lbs. <br/> is set for {primaryGoal.goalTarget}</h5>
                                    <p>Only {Math.round(daysLeft)} more {Math.round(daysLeft) > 1 ? 'days' : 'day'} to go!</p>
                                </> 
                            : 
                            null
                            }

                            { daysLeft > 0 && daysLeft < 1 ? <h5>Tomorrow is your target date!</h5> : null }
                            <button 
                                id="dismiss" 
                                onClick={this.closeNotifier} 
                                className="waves-effect waves-light btn">
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      uid: state.uid,
    }
  }

export default connect(mapStateToProps)(GoalNotifier);