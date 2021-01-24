import React from 'react'
import Weight from './Weight/Weight'
import { connect } from 'react-redux'
import './WeightHistory.scss'

class WeightHistory extends React.Component {

  state = {
    limitedForDisplay: [],
    noHistory: true,
    showingMore: false,
    extraRecordPosition: 0,
    recordsByTens: []
  }

  showLimitedRecs = (iterator) => {
    let limitedForDisplay = [];
    for (let i = 0; i < iterator; i++) {
      limitedForDisplay.push(this.props.weights[i]);
    }
    this.setState({
      limitedForDisplay: limitedForDisplay
    });
  }


  // toggleMore should show 10 records if the length is 10 or more, or if it is less than 10 and greater than 6, should be whatever the length is
  toggleMore = () => {
    let limitedForDisplay = [];
    // find what number to limit it to
    let iterator;
    (this.props.weights.length >= 10) ? iterator = 10 : iterator = this.props.weights.length;
    if (!this.state.showingMore) {
      for (let i = 0; i < iterator; i++) {
        limitedForDisplay.push(this.props.weights[i]);
      }
      this.setState({
        limitedForDisplay: limitedForDisplay,
        showingMore: true
      });
    } else {
      this.showLimitedRecs(6);
      this.setState({
        showingMore: false
      });
    }
  }

  buildMasterRecordSet = () => {
    let weightHistory = this.props.weights
    let recordsByTensArray = [];
    let recordsByTens = [];
    weightHistory.forEach(rec => {
      recordsByTens.push(rec)
    });

    // then compile into a grander data structure, each item 10 in length (first 0 through 9, then 10 through 19, then 20 through 29, etc., so we need to find the max number to go to, which is the length of recordsByTens)
    let maxIteration = recordsByTens.length;

    const addToStateArray = (a, b) => {
      let tempArray = [];
      for (let i = a; i < b; i++) {
        if (recordsByTens[i] !== undefined) {
          tempArray.push(recordsByTens[i]);
        }
      }
      recordsByTensArray.push(tempArray);
    }

    let numberOfSubArrays = Math.ceil(maxIteration/10);

    // call addToStateArray() as many times as you need sub arrays
    function callAppropriately(a) {
      let i = 1;
        do {
          addToStateArray((i*10)-10, i*10);
          i++;
        }
        while (i <= a)
      }
    callAppropriately(numberOfSubArrays);

    this.setState({
      recordsByTens: recordsByTensArray
    })
  }


  goForward = () => {
    if (this.state.extraRecordPosition < this.state.recordsByTens.length-1) {
      this.setState(prevState => ({
          extraRecordPosition: prevState.extraRecordPosition+1,
          limitedForDisplay: prevState.recordsByTens[this.state.extraRecordPosition+1]
        }))
    }
  }

  goBack = () => {
    if (this.state.extraRecordPosition > 0) {
      this.setState(prevState => ({
        extraRecordPosition: prevState.extraRecordPosition-1,
        limitedForDisplay: prevState.recordsByTens[this.state.extraRecordPosition-1]
      }))
    }
  }

  handleWeightHistory = () => {
    let weightHistory = this.props.weights
    if (weightHistory.length > 0) {
      this.setState({
        noHistory: false
      })
    }
    let iterator = (weightHistory.length > 6) ? 6 : weightHistory.length;
    this.showLimitedRecs(iterator);
    // lastly, if there are 11 or more records, build an array of arrays, each sub array being 10 items in length, to go back and forth through in the Recent Weight Logs modal
    this.buildMasterRecordSet();
  }


  componentDidMount() {
    this.handleWeightHistory();
  }


  render() {
    const { noHistory, limitedForDisplay, extraRecordPosition, recordsByTens, showingMore } = this.state;

    return (
      <div>
        <div id="data-row">
          { noHistory ? <p>You haven't recorded any weights.</p> :
           limitedForDisplay.map((weight) => {
            let date = (new Date(weight.date.date.seconds * 1000)).toString();
            let dateStringArray = date.split(' ');
            let dateString = [dateStringArray[1], dateStringArray[2], dateStringArray[3]].join(' ');
            return <Weight
              index={weight.date.date.seconds}
              weight={weight.weight}
              date={dateString}
            />
        })
      }
      { showingMore && recordsByTens.length > 1 ?
         <div className="button-div">
          <button
              disabled={extraRecordPosition === 0}
              className="waves-effect waves-light btn"
              onClick={this.goBack} 
            >
            <i className="fas fa-chevron-left"></i>
            </button>
          <button 
              disabled={extraRecordPosition === recordsByTens.length-1}
              className="waves-effect waves-light btn"
              onClick={this.goForward} 
              >
            <i className="fas fa-chevron-right"></i>
          </button>
         </div>
         : null
       }
        </div>
      {
        extraRecordPosition === 0 && this.props.weights.length > 5 ? <button 
        className="waves-effect waves-light btn"
        id="toggler"
        onClick={this.toggleMore}>View {showingMore ? "less" : "more"}</button> : null
      }
      </div>
      )
  }
}

const mapStateToProps = (state) => {
  return {
    uid: state.uid
  }
}

export default connect(mapStateToProps)(WeightHistory);
