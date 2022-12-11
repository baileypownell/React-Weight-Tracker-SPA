import { Button } from '@mui/material'
import { useState } from 'react'
import { connect } from 'react-redux'
import './GoalNotifier.scss'

const GoalNotifier = (props: { primaryGoal: any}) => {
    const [daysLeft, setDaysLeft] = useState<number | null>(null)
    const { primaryGoal } = props;

    return (
        <div>
            <a></a>
            <div className="tap-target" data-target="menu">
                <div className="tap-target-content">
                    <div className="goal-content">
                        { daysLeft !== null && daysLeft >= 1 ? 
                            <>
                                <h5>Your next goal of {primaryGoal.goalWeight} lbs. <br/> is set for {primaryGoal.goalTarget}</h5>
                                <p>Only {Math.round(daysLeft)} more {Math.round(daysLeft) > 1 ? 'days' : 'day'} to go!</p>
                            </> 
                        : 
                        null
                        }

                        { daysLeft !== null && daysLeft > 0 && daysLeft < 1 ? <h5>Tomorrow is your target date!</h5> : null }
                        <Button 
                            // onClick={closeNotifier} 
                            onClick={() => console.log('close')}
                            variant="contained">
                            Dismiss
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = state => {
    return {
      uid: state.uid,
    }
  }

export default connect(mapStateToProps)(GoalNotifier);