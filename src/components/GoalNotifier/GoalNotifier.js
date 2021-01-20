
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
        let daysLeft = targetDate.diff(nowDate, 'days').values.days
        let daysLeftRounded = Math.round(daysLeft)
        this.setState({
            daysLeft: daysLeftRounded
        })
     }

     closeNotifier() {
        instance.close()
     }


    render() {

        return (
            <div>
                <a id="menu" ></a>
                <div className="tap-target" data-target="menu">
                    <div className="tap-target-content">
                        { this.state.daysLeft > 1 ? 
                            <>
                                <h5>Your next goal of {this.props.primaryGoal.goalWeight} lbs. is set for {this.props.primaryGoal.goalTarget}</h5>
                                <p>Only {this.state.daysLeft} more days to go!</p>
                            </> 
                          : 
                          null
                        }
                        {
                            this.state.daysLeft === 0 ? <h5>Today is your target date!</h5> : null
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