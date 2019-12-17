import React from 'react';
import './LineGraph.scss';

export default class LineGraph extends React.Component {

  state = {
    graphTimePeriod: null
  }

  setGraphTimePeriod = (e) => {
    this.setState({
      graphTimePeriod: e.target.value
    })
    let labels = [];
    let data = [];
    if (this.state.graphTimePeriod === 'week') {
      for (let i = 7; i > 0; i--) {
        // first make sure each value is within a week of now
        let now = new Date();
        console.log(now);
        let exactlyWeekFromNow = now.getDate() - 7;
        console.log(exactlyWeekFromNow);
        let exactlyWeekFromNowSeconds = now.setDate(exactlyWeekFromNow);
        console.log("exactly a week ago", exactlyWeekFromNowSeconds);
        console.log("data date:", this.state.entireSortedWeightHistory[i].date.date.seconds);
        // if (this.state.entireSortedWeightHistory[i].date.date.seconds > exactlyWeekFromNowSeconds) {
        //   let date = new Date(this.props.entireSortedWeightHistory[i].date.date.seconds * 1000);
        //   let day = date.toUTCString().split(' ')[1];
        //   let month = date.toUTCString().split(' ')[2];
        //   let fullDate = [month, day].join(' ');
        //   labels.push(fullDate);
        //   data.push(this.props.entireSortedWeightHistory[i].weight)
        // }
      }
      console.log(data)
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

  render() {
    return (
      <div id="graph">
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
