
import React from 'react'
import './Goal.scss'
import { connect } from 'react-redux'

class Goal extends React.Component {
    state = {
        goalWeight: '',
        goalTarget: '',
        datepicker: ''
    }

    componentDidMount() {
        var elems = document.querySelectorAll('.datepicker');
        var instances = M.Datepicker.init(elems, {
            minDate: new Date(),
            format: 'mmm dd, yyyy',
            onSelect: (e) => { console.log(e); this.setState({ goalTarget: e})}
        });
        this.setState({
            datepicker: instances
        })

        // confirmation modal 
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, options);
    }

    handleChange = (e)  => {
        if (e.target.value > 0 || e.target.value === '') {
            this.setState({
                [e.target.id]: e.target.value
            })
        }
    }

    addGoal = () => {
        const db = firebase.firestore();
        db.collection("users").doc(this.props.localId).update({
           goals: [{
               goalWeight: this.state.goalWeight, 
               goalTarget: this.state.goalTarget
           }]
        })
        .then(res => {
            M.toast({ html: 'Goal added!'})
            this.setState({
                goalWeight: '', 
                goalTarget: ''
            })   
        })
        .catch(err => console.log(err))
    }

    deleteGoal = () => {
        db.collection("users").doc(this.props.localId).update({
            goals: []
        })
        .then(() => M.toast({ html: 'Goal deleted.'}))
        .catch(err => console.log(err))
    }


    render() {
        const { goal } = this.props; 

        return (
            <div id="goal">
                { this.props.goal ? 
                <>
                    <h5>Your Goal</h5>
                    <div className="goal-item">
                        <div>
                            <p>Target Weight: {goal.goalWeight}</p>
                            <p>Goal Date: {goal.goalTarget.seconds}</p>
                        </div>
                        
                        <div className="delete-goal modal-trigger" href="#confirmationModal">
                            <i class="fas fa-trash"></i>
                        </div>
                    </div>
                    {/* confirmation modal */}
                    <div id="confirmationModal" class="modal">
                        <div class="modal-content">
                            <h4>Confirm Goal Deletion</h4>
                            <p>Are you sure you want to delete your goal?</p>
                        </div>
                        <div class="modal-footer">
                            <a class="modal-close waves-effect btn-flat">No</a>
                            <a class="modal-close waves-effect btn-flat" onClick={this.deleteGoal}>Yes</a>
                        </div>
                    </div>
                </> : 
                <>
                    <h5>Add a goal</h5>
                    <input value={this.state.goalTarget} type="text" placeholder="Select goal target date" className="datepicker"></input>
                    <input 
                        type="text" 
                        value={this.state.goalWeight} 
                        id="goalWeight" 
                        placeholder="Enter a target weight" 
                        onChange={this.handleChange}>
                    </input>
                    <button 
                        onClick={this.addGoal}
                        className={ this.state.goalTarget && this.state.goalWeight ?  "waves-effect waves-light btn" : "waves-effect waves-light btn disabled"}>
                            Add Goal
                    </button>
                </>
                }
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
      localId: state.localId,
    }
  }

export default connect(mapStateToProps)(Goal);