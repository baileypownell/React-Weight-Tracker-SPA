import React from 'react';
import './LineGraph.scss';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';

class LineGraph extends React.Component {

  state = {
    graphTimePeriod: 'week'
  }

  setGraphTimePeriod = (e) => {
    // use this if statement so that componentDidMount() can run
    if (e) {
      this.setState({
        graphTimePeriod: e.target.value
      })
    }
    let labels = [];
    let data = [];
    if (this.state.graphTimePeriod === 'week') {
      // get all of the entries from the past 7 days (there are 7 or less) and put them into data array
      for (let i = 0; i <= 7; i++) {
        // first make sure each value is within a week of now in seconds
        const now = new Date()
        const secondsSinceEpoch = Math.round(now.getTime() / 1000)
        let exactlyWeekAgo = secondsSinceEpoch - 604800;
        //console.log("exactly a week ago", exactlyWeekAgo);
        //console.log(this.props.entireSortedWeightHistory[i].date.date.seconds)
        // compare seconds from exactly a week ago to seconds of the record, and only go on if the seconds of the record are greater than the seconds of exactly a week in the past
        if (this.props.entireSortedWeightHistory[i].date.date.seconds > exactlyWeekAgo) {
          let date = new Date(this.props.entireSortedWeightHistory[i].date.date.seconds * 1000);
          let day = date.toUTCString().split(' ')[1];
          let month = date.toUTCString().split(' ')[2];
          let fullDate = [month, day].join(' ');
          labels.push(fullDate);
          data.push(this.props.entireSortedWeightHistory[i].weight)
        }
      }
    } else if (this.state.graphTimePeriod === 'month') {

    } else if (this.state.graphTimePeriod === 'year') {

    }
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Pounds',
            data: data,
            backgroundColor: 'rgb(38, 232, 232)',
            hoverBackgroundColor: 'rgba(0, 0, 0, 0)',
            borderColor: [
                'rgb(94, 244, 86)'
            ],
            borderWidth: 2
        }]
      },
      options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
      }
    });
  }

  // necessary so we don't have an ugly empty graph
  componentDidMount() {
    this.setGraphTimePeriod();
  }

  render() {
    return (
      <div className="white-box">
        <h2>Your weight over the past: </h2>
        <div>
          <button value="week" onClick={this.setGraphTimePeriod} className={this.state.graphTimePeriod === "week" ? "time-period selected": "time-period"}>week</button>
          <button value="month" onClick={this.setGraphTimePeriod} className={this.state.graphTimePeriod === "month" ? "time-period selected" : "time-period" }>month</button>
          <button value="year" onClick={this.setGraphTimePeriod} className={this.state.graphTimePeriod === "year" ? "time-period selected" : "time-period"}>year</button>
        </div>
        <div id="canvas-parent">
          <canvas id="myChart" width="400" height="400"></canvas>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    entireSortedWeightHistory: state.user.weightHistory
  }
}

export default connect(mapStateToProps)(LineGraph);
