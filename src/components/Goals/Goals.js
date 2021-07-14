
import React from 'react'
import './Goal.scss'
import { connect } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import firebase from '../../firebase-config'
var { DateTime } = require('luxon')
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import Chip from '@material-ui/core/Chip'
import DoneIcon from '@material-ui/icons/Done';
let myDoughnutChart

class Goals extends React.Component {

    state = {
        goalWeight: '',
        goalTarget: '',
        goalToDeleteId: '',
        selectedGoal: '',
        goalTargetUnix: '',
        showGoalDeleteConfirmationModal: false
    }

    componentDidMount() {
        const elems = document.querySelectorAll('.datepicker')
        M.Datepicker.init(elems, {
            minDate: new Date(),
            format: 'mmm dd, yyyy',
            onSelect: (e) => { 
                this.setState({ 
                    goalTarget: DateTime.fromISO(new Date(e).toISOString()).toFormat('DDD'),
                    goalTargetUnix: DateTime.fromISO(new Date(e).toISOString()).toFormat('X'),
                })
            }
        })

        if (this.props.goals.length) {
            this.setState({
                selectedGoal: this.props.goals[0]
            }, () => {
                this.constructChart()
            })
        }


        let lastWeight = this.props.weights.length ? Number(this.props.weights[0].weight) : 0
        let goalWeightDifference = this.props.goals.length ? 
            (Number(this.props.goals[0].goalWeight) - lastWeight).toFixed(2)
            : 0
     
        let data = {
            labels: ['Current weight', 'Pounds left to reach your goal'],
            datasets: [{
                data: [lastWeight, goalWeightDifference],
                backgroundColor: [
                    '#ffd6de',
                ],
                borderWidth: 1
            }]
        }
        var ctx = document.getElementById('goalGraph');
        myDoughnutChart = new Chart(ctx, {
            type: 'doughnut',
            data,
            options: {
                legend: {
                    onClick: (e) => e.stopPropagation()
                }
            }
        })
    }

    componentDidUpdate(prevProps) {
        this.constructChart()
    }

    constructChart = () => {
        let lastWeight = Number(this.props.weights[0].weight).toFixed(1)
        let goalWeightDifference = (Number(this.state.selectedGoal.goalWeight) - lastWeight).toFixed(1) 
        let data = {
            labels: ['Current weight', 'Pounds left to reach your goal'],
            datasets: [{
                data: [lastWeight, goalWeightDifference],
                backgroundColor: [
                    '#B6C757',
                    '#595758'
                ],
                borderWidth: 0.5
            }]
        }
        myDoughnutChart.data.datasets = data.datasets        
        myDoughnutChart.update();
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
        db.collection("users").doc(this.props.uid).update({
           goals: this.props.goals.concat({
                goalWeight: this.state.goalWeight, 
                goalTarget: this.state.goalTarget,
                goalTargetUnix: this.state.goalTargetUnix,
                baseWeight: this.props.weights[0].weight,
                complete: false, 
                incomplete: false,
                id: uuidv4(),
            })
        })
        .then(res => {
            M.toast({ html: 'Goal added!'})
            this.setState({
                goalWeight: '', 
                goalTarget: '',
                goalTargetUnix: ''
            })   
            this.props.updateGoals()
        })
        .catch(err => console.log(err))
    }

    deleteGoal = () => {
        let updatedGoals = this.props.goals.filter(goal => goal.id !== this.state.goalToDeleteId)
        const db = firebase.firestore();
        db.collection("users").doc(this.props.uid).update({
            goals: updatedGoals
        })
        .then(() => {
            M.toast({ html: 'Goal deleted.'})
            this.setState({
                selectedGoal: ''
            })
            this.props.updateGoals()
        })
        .catch(err => console.log(err))
    }

    openConfirmationDialog = (goalId) => {
        this.setState({
            goalToDeleteId: goalId,
            showGoalDeleteConfirmationModal: true
        })
    }

    handleUserSelection = (userSelection) => {
        this.setState({
            showGoalDeleteConfirmationModal: false
        })
    }

    showGraph = (goalId) => {
        let goal = this.props.goals.find(goal => goal.id === goalId)
        this.setState({
            selectedGoal: goal
        }, () => this.constructChart())
    }


    render() {
        const { goals } = this.props; 
        const { 
            showGoalDeleteConfirmationModal, 
            goalTarget, 
            goalWeight, 
            selectedGoal 
        } = this.state;

        return (
            <div id="goal-parent">
                <h5>Your Goals</h5>
                <div id="goal">
                    <div>
                        <div id="add-goal">
                            <h6>Add a goal</h6>
                            <input 
                                value={goalTarget} 
                                type="text" 
                                placeholder="Select goal target date" 
                                readOnly
                                className="datepicker">
                            </input>
                            <input 
                                type="text" 
                                value={goalWeight} 
                                id="goalWeight" 
                                placeholder="Enter a target weight" 
                                onChange={this.handleChange}>
                            </input>
                            <Button 
                                onClick={this.addGoal}
                                variant="contained"
                                color="secondary"
                                disabled={goalTarget && goalWeight ? false : true}>
                                Add Goal
                            </Button>
                        </div>
                        {goals.map((goal, index) => (
                            <div 
                                key={index}
                                className={selectedGoal && selectedGoal.id === goal.id ? 
                                    "goal-item selected-goal": 
                                    "goal-item"} 
                                onClick={() => this.showGraph(goal.id)}>
                                <div>
                                    <p>Target Weight: { Number(goal.goalWeight).toFixed(1) } lbs.</p>
                                    <p>Goal Date: {  goal.goalTarget }</p>
                                    { goal.incomplete ? <Chip label="Incomplete" variant="outlined" /> : null }
                                    { goal.complete ? <Chip icon={<DoneIcon />} color="secondary" label="Complete" variant="outlined" /> : null }
                                </div>
                                
                                <Button 
                                    variant="contained" 
                                    className="delete-goal" 
                                    onClick={() => this.openConfirmationDialog(goal.id)}>
                                    <i className="fas fa-trash"></i>
                                </Button>
                            </div>
                        ))
                    }
                    </div>
               
                    <div className={selectedGoal ? "white-box" : "hidden"}>
                        <h6>Target Weight</h6><span id="goal-weight">{ Number(this.state.selectedGoal.goalWeight).toFixed(1) } lbs. </span>
                        <span>
                            { selectedGoal.incomplete ? 
                                <Chip label="Incomplete" variant="outlined" />
                            : null }
                        </span>
                        <span>
                            { selectedGoal.complete ?  
                                <Chip icon={<DoneIcon />} label="Complete" color="secondary" variant="outlined" />
                            : null }
                        </span>
                        <canvas id="goalGraph" width="300" height="300"></canvas>
                    </div> 

                    <Dialog aria-labelledby="simple-dialog-title" open={showGoalDeleteConfirmationModal}>
                        <DialogTitle id="simple-dialog-title">Confirm Goal Deletion</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete your goal?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                        <Button 
                            variant="outlined" 
                            onClick={() => this.setState({showGoalDeleteConfirmationModal: false})}>
                            Cancel
                        </Button>
                        <Button 
                            variant="outlined" 
                            color="secondary" 
                            onClick={this.deleteGoal} autoFocus>
                            Confirm
                        </Button>
                        </DialogActions>
                    </Dialog>
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

export default connect(mapStateToProps)(Goals);