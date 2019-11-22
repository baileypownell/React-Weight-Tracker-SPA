import React from 'react';
import Weight from './Weight';
// imports for connecting this component to Redux state store
//import { connect } from 'react-redux';

// map each element of weightHistory to a div


class WeightHistory extends React.Component {

  state = {
    weightsToShow: []
  }

  showLimitedRecs = (iterator) => {
    console.log('showLimitedRecs running');
    console.log(this.props.weightHistory.length);
    let weightsToShow = [];
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
    for (let i = 0; i < iterator; i++) {
      weightsToShow.push(sortedAllWeightsRecorded[i]);
    }
    console.log('weightsToShow variable is' + weightsToShow);
    this.setState({
      weightsToShow: weightsToShow
    });
    console.log(this.state);
  }

  componentDidMount() {
    let iterator = undefined;
    if (this.props.weightHistory.length > 5) {
      iterator = 5;
    } else {
      iterator = allWeightsRecorded.length;
    }
    console.log('component did mount');
    this.showLimitedRecs(iterator);
  }

  showMore = () => {
    console.log('showMore running', this.props.weightHistory.length);
    let weightsToShow = [];
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
          {this.state.weightsToShow.map((weight) => {
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
        <button onClick={this.showMore}>VIEW MORE</button>
      </div>
      )
  }
}




export default WeightHistory;
