import React from 'react';
import Weight from './Weight';
// imports for connecting this component to Redux state store
//import { connect } from 'react-redux';



// // map each element of weightHistory to a div
// class WeightHistory extends React.Component {
//   render() {
//     let allWeightsRecorded = this.props.weightHistory;
//     let weightsToShow = [];
//     for (let i = 0; i < 5; i++) {
//       weightsToShow.push(allWeightsRecorded[i]);
//     }
//     console.log(weightsToShow);
//     return (
//       <div id="data-row">
//         {weightsToShow.map((num) => <Weight
//           key="key"
//           weight={num}
//           date="today"/>)}
//       </div>
//       )
//   }
// }

// map each element of weightHistory to a div
class WeightHistory extends React.Component {
  render() {
    let allWeightsRecorded = this.props.weightHistory;
    let weightsToShow = [];
    // limit the weights to show to a certain number that can be no greater than the number of recorded weights, and no greater than 5
    let iterator = undefined;
    if (allWeightsRecorded.length > 5) {
      iterator = 5;
    } else {
      iterator = allWeightsRecorded.length;
    }
    console.log(iterator); //expect 3
    for (let i = 0; i < iterator; i++) {
      weightsToShow.push(allWeightsRecorded[i]);
    }
    console.log(weightsToShow);

    return (
      <div id="data-row">
        {weightsToShow.map((weight) => <Weight
          key="key"
          weight={weight.weight}
          date="today"/>)}
      </div>
      )
  }
}




export default WeightHistory;
