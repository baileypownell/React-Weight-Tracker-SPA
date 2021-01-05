
import React from 'react'
import './Goal.scss'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
var { DateTime } = require('luxon');

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
            onSelect: (e) => { this.setState({ goalTarget: e})}
        });
        this.setState({
            datepicker: instances
        })

        // confirmation modal 
        var elems = document.querySelectorAll('.modal');
        var instances = M.Modal.init(elems, {});
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
           goals: this.props.goals.concat({
                goalWeight: this.state.goalWeight, 
                goalTarget: this.state.goalTarget,
                id: uuidv4()
            })
        })
        .then(res => {
            M.toast({ html: 'Goal added!'})
            this.setState({
                goalWeight: '', 
                goalTarget: ''
            })   
            this.props.updateGoals()
        })
        .catch(err => console.log(err))
    }

    deleteGoal = () => {
        db.collection("users").doc(this.props.localId).update({
            goals: []
        })
        .then(() => {
            M.toast({ html: 'Goal deleted.'})
            this.props.updateGoals()
        })
        .catch(err => console.log(err))
    }


    render() {
        const { goals } = this.props; 

        return (
            <div id="goal">
                    <h5>Your Goals</h5>
                    <div id="add-goal">
                        <h6>Add a goal</h6>
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
                    </div>
                    {
                        goals.map(goal => {
                            return (
                                <div className="goal-item">
                                <div>
                                    <p>Target Weight: {goal.goalWeight}</p>
                                    <p>Goal Date: {  DateTime.fromISO(new Date(goal.goalTarget.seconds * 1000 ).toISOString()).toFormat('yyyy LLL dd') }</p>
                                </div>
                                
                                <div className="delete-goal modal-trigger" href="#confirmationModal">
                                    <i class="fas fa-trash"></i>
                                </div>
                            </div>
                            )
                        })
                    }
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