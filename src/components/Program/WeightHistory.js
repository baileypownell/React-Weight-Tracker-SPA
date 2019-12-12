import React from 'react';
import Weight from './Weight';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';

// map each element of weightHistory to a div


class WeightHistory extends React.Component {

  state = {
    weightsToShow: []
  }



  showLimitedRecs = (iterator) => {
    let weightsToShow = [];
    // sort by newest to show, based on the seconds property of the date object
    let allWeightsRecorded = this.props.weightHistory;
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
    let sortedAllWeightsRecorded = allWeightsRecorded.sort(compare);
    for (let i = 0; i < iterator; i++) {
      weightsToShow.push(sortedAllWeightsRecorded[i]);
    }

    this.setState({
      weightsToShow: weightsToShow
    });

  }

  componentDidMount() {
    let length;
    // get most recent records
    const db = firebase.firestore();
    // find the newest weight records
    db.collection("users").doc(this.props.localId).get().then((doc) => {
      length = doc.data().weights.length-1;
      // new array of objects
      let weightHistory = doc.data().weights;
      this.setState({
        weightsToShow: weightHistory
      });
    })
    .then(err => {
      console.log(err)
    });
    let iterator = undefined;
    (length > 5) ? iterator = 5 : iterator = length;
     console.log(iterator)
    // this.showLimitedRecs(iterator);
  }


  showMore = () => {
    let weightsToShow = [];
    // sort by newest to show, based on the seconds property of the date object
    let allWeightsRecorded = this.props.weightHistory;
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
    let sortedAllWeightsRecorded = allWeightsRecorded.sort(compare);
    for (let i = 0; i < this.props.weightHistory.length; i++) {
      weightsToShow.push(sortedAllWeightsRecorded[i]);
    }
    this.setState({
      weightsToShow: weightsToShow
    });
  }

  render() {
    return (
      <div>
        <div id="data-row">
          {!this.props.latestData ? this.state.weightsToShow.map((weight) => {
            let date = (new Date(weight.date.date.seconds * 1000)).toString();
            let dateStringArray = date.split(' ');
            let dateString = [dateStringArray[1], dateStringArray[2], dateStringArray[3]].join(' ');
            return <Weight
              key={weight.date.date.seconds}
              weight={weight.weight}
              date={dateString}
            />
            })
           : this.props.latestData.map((weight) => {
            let date = (new Date(weight.date.date.seconds * 1000)).toString();
            let dateStringArray = date.split(' ');
            let dateString = [dateStringArray[1], dateStringArray[2], dateStringArray[3]].join(' ');
            return <Weight
              key={weight.date.date.seconds}
              weight={weight.weight}
              date={dateString}
            />
        }) }
        </div>
        <button onClick={this.showMore}>VIEW MORE</button>
      </div>
      )
  }
}

const mapStateToProps = (state) => {
  return {
    weightHistory: state.weightHistory,
    todaysWeight: state.todaysWeight,
    localId: state.localId
  }
}


export default connect(mapStateToProps)(WeightHistory);
