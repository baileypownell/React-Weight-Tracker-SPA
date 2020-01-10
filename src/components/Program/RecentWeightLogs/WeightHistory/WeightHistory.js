import React from 'react';
import Weight from './Weight/Weight';
import PriorRecords from './PriorRecords/PriorRecords'
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actions from '../../../../store/actionCreators';


class WeightHistory extends React.Component {

  // limitedForDisplay should remain as is for optimization; we should only make an array of subarrays if the length of the data we get back in the API is greater than 10 records. Thus, we should handle extra records in the API call.
  state = {
    entireSortedWeightHistory: [],
    limitedForDisplay: [],
    noHistory: true,
    showingMore: false,
    extraRecords: null,
    showingPrior: false
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


  // toggleMore should show 10 records if the length is 10 or more, or if it is less than 10 and greater than 6, should be whatever the length is
  toggleMore = () => {
    let limitedForDisplay = [];
    // find what number to limit it to
    let iterator;
    (this.state.entireSortedWeightHistory.length >= 10) ? iterator = 10 : iterator = this.state.entireSortedWeightHistory.length;
    if (!this.state.showingMore) {
      for (let i = 1; i < iterator; i++) {
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

  // the function called when the page is loaded in turn calls this function, if there are 11 or more records
  assimilateRecords = (weightHistory) => {
    let extraRecordsArray = [];
    // first assimilate all extra records
    let extraRecords = [];
    for (let i = 10; i < weightHistory.length; i++) {
      extraRecords.push(weightHistory[i]);
    }
    console.log("extraRecords = ", extraRecords);

    // then compile into a grander data structure, each item 10 in length
    // first 0 and 10, then 10 and 20, then 20 and 30, etc., so we need to find the max number to go to, which is the length of extraRecords.
    let maxIteration = extraRecords.length;
    console.log("the maxIteration is ", maxIteration);

    const addToStateArray = (a, b) => {
      let tempArray = [];
      for (let i = a; i < b; i++) {
        if (extraRecords[i] !== undefined) {
          tempArray.push(extraRecords[i]);
        }
      }
      extraRecordsArray.push(tempArray);
    }

    if (maxIteration < 10) {
      addToStateArray(0, maxIteration);
      console.log("the extraRecordsArray is equal to: ", extraRecordsArray);
    } else {
      // then find how many numbers evenly divisible by 10 are between the maxIteration and 0 for an else statement above this
      let numbersEvenlyDivisbleBy10 = 0;
      for (let i = 1; i <= maxIteration; i++) {
        if (i % 10 === 0) {
          numbersEvenlyDivisbleBy10++;
        }
      }
      console.log("numbersEvenlyDivisbleBy10 = ", numbersEvenlyDivisbleBy10);

      // with that number, call addToStateArray() as many times
      function callAppropriately(numbersEvenlyDivisbleBy10) {
        let i = 0;
        // if numbersEvenlyDivisbleBy10 = 0, call addToStateArray(0, maxIteration)
        // if numbersEvenlyDivisbleBy10 = 1, call addToStateArray(0, 10)
        // if numbersEvenlyDivisbleBy10 = 2, call addToStateArray(10, 20)
        // if numbersEvenlyDivisbleBy10 = 3, call addToStateArray(20, 30)
        do {
          addToStateArray((i*10)-10, i*10);
          i++;
        }
        while (i < numbersEvenlyDivisbleBy10)
      }
      callAppropriately(numbersEvenlyDivisbleBy10);
    }
    this.setState({
      extraRecords: extraRecordsArray
    })
  }

  goForward = () => {
    this.setState({
      limitedForDisplay: [],
      showingPrior: true
    })
  }

  // called when the page is loaded
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
        // lastly, if there are 11 or more records, build an array of arrays, each sub array being 10 items in length, to go back and forth through in the Recent Weight Logs modal
        if ( weightHistory.length > 10) {
          this.assimilateRecords(weightHistory);
        }
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
          {this.props.todaysWeight && !this.state.showingPrior ? <Weight
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
              key={weight.date.date.seconds}
              weight={weight.weight}
              date={dateString}
            />
        })
      }
        {this.state.showingMore ?
          <>
          <button className="back-forth"><i className="fas fa-chevron-left"></i></button>
          <button onClick={this.goForward} className="back-forth"><i className="fas fa-chevron-right"></i></button>
          </>
          : null }
        {this.state.showingPrior ?
        <PriorRecords extraRecords={this.state.extraRecords}/>
           : null }
        </div>
        {!this.state.showingPrior ? <button onClick={this.toggleMore}>VIEW {this.state.showingMore ? "LESS" : "MORE"}</button> : null }
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
