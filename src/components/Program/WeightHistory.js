import React from 'react';
import Weight from './Weight';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';

// map each element of weightHistory to a div


class WeightHistory extends React.Component {

  state = {
    weightsToShow: '',
    limitedForDisplay: []
  }



  showLimitedRecs = (iterator) => {
    let limitedForDisplay = [];
    for (let i = 0; i < iterator; i++) {
      limitedForDisplay.push(this.state.weightToShow[i]);
    }
    this.setState({
      limitedForDisplay: limitedForDisplay
    });
  }

  // componentDidMount() {
  //   // get most recent records
  //   const db = firebase.firestore();
  //   db.collection("users").doc(this.props.localId).get().then((doc) => {
  //     let weightHistory = doc.data().weights;
  //     // sort by date
  //     // function compare(a, b) {
  //     //   const secondsA = a.date.date.seconds;
  //     //   const secondsB = b.date.date.seconds;
  //     //   let comparison = 0;
  //     //  if (secondsA < secondsB) {
  //     //    comparison = 1;
  //     //  } else if (secondsA > secondsB) {
  //     //    comparison = -1;
  //     //  }
  //     //  return comparison;
  //     // }
  //     // let sortedAllWeightsRecorded = weightHistory.sort(compare);
  //     // this.setState({
  //     //   weightsToShow: sortedAllWeightsRecorded
  //     // });
  //     let iterator = (weightHistory.length > 5) ? 5 : length;
  //     this.showLimitedRecs(iterator);
  //   })
  //   .then(err => {
  //     console.log(err)
  //   });
  // }


  showMore = () => {
    let limitedForDisplay = [];
    for (let i = 0; i < this.state.weightHistory.length; i++) {
      limitedForDisplay.push(this.state.weightToShow[i]);
    }
    this.setState({
      limitedForDisplay: limitedForDisplay
    });
  }

  render() {
    return (
      <div>
        <div id="data-row">
          {!this.props.latestData ? this.props.weightHistory.map((weight) => {
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
