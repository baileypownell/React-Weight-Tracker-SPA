import React from 'react'
import M from 'materialize-css'
import './WeightLogger.scss'
import { connect } from 'react-redux'

export class WeightLogger extends React.Component {


  state = {
    formInputEmpty: true,
    todaysWeight: null,
    updatedWeight: ''
  }

  componentDidMount() {
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {});
  }

  handleChange = (e) => {
    if (e.target.value > 1) {
      this.setState({
        formInputEmpty: false,
        todaysWeight: e.target.value
      });
    } else {
      this.setState({
        formInputEmpty: true
      });
    }
  }

  handleUpdateChange = (e) => {
    this.setState({
      updatedWeight: e.target.value
    });
  }


  logWeight = (e) => {
    e.preventDefault()
    const db = firebase.firestore();
    let date = new Date();
    let updatedWeights = this.props.weights.concat({
      date: {date},
      weight: this.state.todaysWeight
    });
    db.collection("users").doc(this.props.uid).update({
      weights: updatedWeights
    })
    .then(() => {
      this.props.updateWeightHistory()
      // clear input 
      this.setState({
        todaysWeight: '',
        formInputEmpty: true
      })
    })
    .catch(err => console.log(err))
  } 
  

  updateTodaysWeight = () => {
      let allWeights = this.props.weights;
      let recordToUpdate = allWeights[0];
      recordToUpdate.weight = this.state.updatedWeight;
      const db = firebase.firestore();
      db.collection("users").doc(this.props.uid).update({
          weights: allWeights
      })
      .then(() => {
        M.toast({html: 'Weight updated.'})
        this.props.updateWeightHistory()
        this.setState({
          updatedWeight: ''
        })
      })
      .catch(err => {
        console.log(err);
        M.toast({html: 'Weight could not be updated.'})
      })
    }


  render() {
    const { todaysWeight, formInputEmpty, updatedWeight } = this.state;
    return (
      <div id="weight-logger">
          <div id="modal1" className="modal">
            <div className="modal-content">
                <div className="input-field">
                <label className="active" htmlFor="update-weight">Update today's weight</label>
                <input 
                  type="text" 
                  placeholder={this.props.todaysWeight} 
                  value={updatedWeight} 
                  id="updatedWeight" 
                  onChange={this.handleUpdateChange}>
                </input>
              </div>
            </div>
            <div className="modal-footer">
              <a 
                onClick={this.updateTodaysWeight} 
                className="modal-close waves-effect waves-light btn">
                Update
              </a>
            </div>
          </div>
          <form>
              {
                !this.props.todaysWeight ? 
                <div className="input-field">
                <label htmlFor="weight">Record Weight</label>
                <input 
                  id="weight" 
                  value={this.state.todaysWeight} 
                  onChange={this.handleChange} 
                  type="text">
                </input>
                </div> : null 
              }
              <div>
                {
                  !this.props.todaysWeight ? 
                  <button
                    disabled={formInputEmpty || this.props.todaysWeight}
                    onClick={this.logWeight} 
                    className="waves-effect waves-light btn">
                      Log Weight
                  </button>
                  : 
                  <button
                    disabled={this.props.todaysWeight ? false : true}
                    data-target="modal1"
                    className={"waves-effect waves-light btn modal-trigger"}>
                      Edit today's weight
                  </button>
                }
              </div>
          </form>
        {this.props.todaysWeight ? <h6>Today's Weight: {this.props.todaysWeight} lbs.</h6> : null }
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    uid: state.uid,
  }
}

export default connect(mapStateToProps)(WeightLogger);
