import React from 'react'
import './WeightLogger.scss'
import { connect } from 'react-redux'
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import firebase from '../../../firebase-config'

export class WeightLogger extends React.Component {


  state = {
    formInputEmpty: true,
    todaysWeight: undefined,
    updatedWeight: '',
    editModalOpen: false
  }

  componentDidMount() {
    var elems = document.querySelectorAll('.modal');
    M.Modal.init(elems, {});
  }

  handleChange = (e) => {
    const numValue = e.target.value.replace(/[^0-9.]/g, '')
    this.setState({
      todaysWeight: numValue
    })

    this.setState({
      formInputEmpty: e.target.value > 1 ? false : true
    })
  }

  handleUpdateChange = (e) => {
    const numValue = e.target.value.replace(/[^0-9.]/g, '')
    this.setState({
      updatedWeight: numValue
    })
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
      let allWeights = this.props.weights
      let recordToUpdate = allWeights[0]
      recordToUpdate.weight = this.state.updatedWeight
      const db = firebase.firestore()
      db.collection("users").doc(this.props.uid).update({
          weights: allWeights
      })
      .then(() => {
        M.toast({html: 'Weight updated.'})
        this.props.updateWeightHistory()
        this.setState({
          updatedWeight: '',
          editModalOpen: false
        })
      })
      .catch(err => {
        console.log(err)
        M.toast({html: 'Weight could not be updated.'})
      })
    }

  triggerEditModalState = (e) => {
    e.preventDefault() // this shouldn't be necessary...?
  
    const newEditModalOpenState = !this.state.editModalOpen
    console.log(newEditModalOpenState)
    this.setState({
      editModalOpen: newEditModalOpenState
    })
  }


  render() {
    const { formInputEmpty, updatedWeight, editModalOpen } = this.state;
    return (
      <div id="weight-logger"> 
          <Dialog aria-labelledby="simple-dialog-title" open={editModalOpen}>
            <DialogTitle id="simple-dialog-title">Update today's weight</DialogTitle>
            <div id="edit-weight">
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
            <DialogActions>
              <Button variant="outlined" onClick={() => this.setState({ editModalOpen: false})}>
                Cancel
              </Button>
              <Button variant="outlined" color="primary" onClick={this.updateTodaysWeight} autoFocus>
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <form>
              {!this.props.todaysWeight ? 
                <div className="input-field">
                  <label htmlFor="weight">Record Weight</label>
                  <input 
                    id="weight" 
                    value={this.state.todaysWeight} 
                    onChange={this.handleChange} 
                    type="text">
                  </input>
                </div> : 
                null }
              <div>
                {!this.props.todaysWeight ? 
                  <Button
                    disabled={formInputEmpty || this.props.todaysWeight ? true : false}
                    onClick={this.logWeight} 
                    variant="contained"
                    color="primary">
                      Log Weight
                  </Button>
                  : 
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={this.props.todaysWeight ? false : true}
                    onClick={this.triggerEditModalState}>
                      Edit today's weight
                  </Button>
                }
              </div>
          </form>
        { this.props.todaysWeight ? 
          <h6>Today's Weight: {this.props.todaysWeight} lbs.</h6> : 
          null }
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
