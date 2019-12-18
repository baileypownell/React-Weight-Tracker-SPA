import React from 'react';
import Weight from './Weight/Weight';

// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actions from '../../../../store/actionCreators';


class WeightHistory extends React.Component {

  // we need to receive todaysWeight as a prop, so that entering todays weight AND updating it (through redux) will, as a change to this components props, trigger a re-render of the component so that componentDidUpdate() will be triggered, refreshing the data we have
  state = {
    entireSortedWeightHistory: [],
    limitedForDisplay: [],
    noHistory: true,
    showingMore: false
  }

  showLimitedRecs = (iterator) => {
    let limitedForDisplay = [];
    for (let i = 1; i < iterator; i++) {
      limitedForDisplay.push(this.state.entireSortedWeightHistory[i]);
    }
    this.setState({
      limitedForDisplay: limitedForDisplay
    });
  }


  toggleMore = () => {
    let limitedForDisplay = [];
    if (!this.state.showingMore) {
      for (let i = 1; i < this.state.entireSortedWeightHistory.length; i++) {
        limitedForDisplay.push(this.state.entireSortedWeightHistory[i]);
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

  getUserWeightHistory = () => {
    function compare(a, b) {
      const secondsA = a.date.date.seconds;
      const secondsB = b.date.date.seconds;
      let comparison = 0;
     if (secondsA < secondsB) {
       comparison = 1;
     } else if (secondsA > secondsB) {
       comparison = -1;
     }
     return comparison;
    }
    // make API call
    const db = firebase.firestore();
    db.collection("users").doc(this.props.localId).get().then((doc) => {
      let weightHistory = doc.data().weights;
        // sort by date
        let sortedAllWeightsRecorded = weightHistory.sort(compare);
        // update redux so that <LineGraph/> can get this data
        this.props.setWeightHistory(sortedAllWeightsRecorded);
        if (sortedAllWeightsRecorded.length > 0) {
          this.setState({
            noHistory: false
          })
        }
        this.setState({
          entireSortedWeightHistory: sortedAllWeightsRecorded
        });
        let iterator = (weightHistory.length > 6) ? 6 : weightHistory.length;
        this.showLimitedRecs(iterator);
      })
      .then(err => {
        console.log(err)
      });
  }

  componentDidMount() {
    this.getUserWeightHistory();
  }

  render() {
    return (
      <div>
        <div id="data-row">
          {this.props.todaysWeight ? <Weight
            id="today"
            weight={this.props.todaysWeight}
            date="Today"
          />: null }
          {this.state.noHistory ? <p>You haven't recorded a weight yet.</p> :
           this.state.limitedForDisplay.map((weight) => {
            let date = (new Date(weight.date.date.seconds * 1000)).toString();
            let dateStringArray = date.split(' ');
            let dateString = [dateStringArray[1], dateStringArray[2], dateStringArray[3]].join(' ');
            return <Weight
              id={weight.date.date.seconds}
              weight={weight.weight}
              date={dateString}
            />
        })
      }
        {this.state.showingMore ?
          <>
          <button className="back-forth"><i class="fas fa-chevron-left"></i></button>
          <button className="back-forth"><i class="fas fa-chevron-right"></i></button>
          </>
          : null }
        </div>
        <button onClick={this.toggleMore}>VIEW {this.state.showingMore ? "LESS" : "MORE"}</button>
      </div>
      )
  }
}

const mapStateToProps = (state) => {
  return {
    todaysWeight: state.todaysWeight,
    localId: state.localId
  }
}

// map entire entireSortedWeightHistory to redux since LineGraph will need it but is not a child of WeightHistory
const mapDispatchToProps = dispatch => {
  return {
    setWeightHistory: (weightHistory) => dispatch(actions.setWeightHistory(weightHistory))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(WeightHistory);
