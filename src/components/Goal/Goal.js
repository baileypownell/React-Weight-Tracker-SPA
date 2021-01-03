
import React from 'react'
import './Goal.scss'

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
            this.setState({
                [e.target.id]: e.target.value
            })
        
    }


    render() {
        return (
            <div id="goal">
                <h5>Add a goal</h5>
                {/* <button className="waves-effect wave-light btn">Add a goal</button> */}
                <input type="text" placeholder="Select goal target date" className="datepicker"></input>
                <input type="text" value={this.state.goalWeight} id="goalWeight" placeholder="Enter a target weight" onChange={this.handleChange}></input>
            </div>
        )
    }
}

export default Goal;