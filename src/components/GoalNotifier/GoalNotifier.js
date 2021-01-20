
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
        var elem = document.querySelector('.tap-target');
        instance = M.TapTarget.init(elem, {});
        instance.open()

        let now = new Date()
        let nowDate = DateTime.fromISO(now.toISOString())
        let targetDate = DateTime.fromISO((new Date(this.props.primaryGoal.goalTargetUnix * 1000).toISOString()))
        console.log(nowDate)
        console.log(targetDate)
        let daysLeft = targetDate.diff(nowDate, 'days').values.days
        console.log(daysLeft)
        let daysLeftRounded = Math.round(daysLeft)
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
                        { daysLeft >= 1 ? 
                            <>
                                <h5>Your next goal of {primaryGoal.goalWeight} lbs. is set for {primaryGoal.goalTarget}</h5>
                                <p>Only {Math.round(daysLeft)} more {Math.round(daysLeft) > 1 ? 'days' : 'day'} to go!</p>
                            </> 
                          : 
                          null
                        }
                        {
                            daysLeft > 0 && daysLeft < 1 ? <h5>Tomorrow is your target date!</h5> : null
                        }
                        <button 
                            id="dismiss" 
                            onClick={this.closeNotifier} 
                            className="waves-effect waves-light btn">
                            Dismiss
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      localId: state.localId,
    }
  }

export default connect(mapStateToProps)(GoalNotifier);