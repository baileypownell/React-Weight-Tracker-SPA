import React from 'react';
import Weight from './Weight';
// imports for connecting this component to Redux state store
//import { connect } from 'react-redux';

// map each element of weightHistory to a div
class WeightHistory extends React.Component {
  render() {
    // sort by newest to show, based on the seconds property of the date object
    let allWeightsRecorded = this.props.weightHistory;
    let sortedAllWeightsRecorded = allWeightsRecorded.sort(compare);
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
    let weightsToShow = [];
        // limit the weights to show to a certain number that can be no greater than the number of recorded weights, and no greater than 5 if the number of recorded weights exceeds 5 // {this.props.todaysWeight ? <Weight
        //   key="todaysWeight"
        //   weight={this.props.todaysWeight}
        //   date={"today"}/> : null}
    let iterator = undefined;
    if (allWeightsRecorded.length > 5) {
      iterator = 5;
    } else {
      iterator = allWeightsRecorded.length;
    }
    for (let i = 0; i < iterator; i++) {
      weightsToShow.push(sortedAllWeightsRecorded[i]);
    }
    let date = new Date();
    return (
      <div id="data-row">
        {weightsToShow.map((weight) => {
          let date = (new Date(weight.date.date.seconds * 1000)).toString();

          let dateStringArray = date.split(' ');
          let dateString = [dateStringArray[1], dateStringArray[2], dateStringArray[3]].join(' ');

          return <Weight
            key={weight.date.date.seconds}
            weight={weight.weight}
            date={dateString}
            />
        })
      }
      </div>
      )
  }
}




export default WeightHistory;
