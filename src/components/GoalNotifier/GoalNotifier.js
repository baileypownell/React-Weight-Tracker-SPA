
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
        // compare the difference between now and the end date to see how many days are left
        // should probably use ISO so that I don't have to round a decimal number...
        console.log(DateTime.fromISO(now.toISOString()))
        let nowDate = DateTime.fromISO(now.toISOString())
        console.log(DateTime.fromSeconds(Number(this.props.primaryGoal.goalTargetUnix)))
        let targetDate = DateTime.fromSeconds(Number(this.props.primaryGoal.goalTargetUnix))
        let daysLeft = targetDate.diff(nowDate, 'days').values.days
        console.log(daysLeft)
        this.setState({
            daysLeft
        })
     }

     closeNotifier() {
        instance.close()
     }


    render() {
        const { primaryGoal } = this.props; 

        return (
            <div>
                <a id="menu" ></a>
                <div className="tap-target" data-target="menu">
                    <div className="tap-target-content">
                        <h5>Your next goal of {primaryGoal.goalWeight} lbs. is set for {primaryGoal.goalTarget}</h5>
                        <p>Only {this.state.daysLeft} more days to go!</p>
                        <button id="dismiss" onClick={this.closeNotifier} className="waves-effect waves-light btn">Dismiss</button>
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