
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
            onSelect: (e) => {this.setState({ goalTarget: e})}
        });
        this.setState({
            datepicker: instances
        })
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
        })
        .catch(err => console.log(err))
    }


    render() {
        return (
            <div id="goal">
                { this.props.goal ? 
                <p>You have a goal</p> : 
                <>
                    <h5>Add a goal</h5>
                    <input type="text" placeholder="Select goal target date" className="datepicker"></input>
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