import React from 'react';
import Weight from './Weight/Weight';

// imports for connecting this component to Redux state store
import { connect } from 'react-redux';


class WeightHistory extends React.Component {

  state = {
    entireSortedWeightHistory: [],
    limitedForDisplay: [],
    noHistory: true
  }

  showLimitedRecs = (iterator) => {
    let limitedForDisplay = [];
    for (let i = 0; i < iterator; i++) {
      limitedForDisplay.push(this.state.entireSortedWeightHistory[i]);
    }
    this.setState({
      limitedForDisplay: limitedForDisplay
    });
  }


  showMore = () => {
    let limitedForDisplay = [];
    for (let i = 0; i < this.state.entireSortedWeightHistory.length; i++) {
      limitedForDisplay.push(this.state.entireSortedWeightHistory[i]);
    }
    this.setState({
      limitedForDisplay: limitedForDisplay
    });
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
        if (sortedAllWeightsRecorded.length > 0) {
          this.setState({
            noHistory: false
          })
        }
        this.setState({
          entireSortedWeightHistory: sortedAllWeightsRecorded
        });
        let iterator = (weightHistory.length > 5) ? 5 : weightHistory.length;
        this.showLimitedRecs(iterator);
      })
      .then(err => {
        console.log(err)
      });
  }

  componentDidMount() {
  //component to sort results of api call
    this.getUserWeightHistory();
  }

  // componentDidUpdate(prevProps) {
  //   console.log('componentDidUpdate()')
  //   if (this.props.shouldUpdate !== prevProps.shouldUpdate) {
  //     console.log('componentDidUpdate() inside if statement')
  //     this.getUserWeightHistory();
  //   }
  // }

  render() {
    return (
      <div>
        <div id="data-row">
          {this.state.noHistory ? <p>You haven't recorded a weight yet.</p> :
           this.state.entireSortedWeightHistory.map((weight) => {
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
        </div>
        <button onClick={this.showMore}>VIEW MORE</button>
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


export default connect(mapStateToProps)(WeightHistory);
