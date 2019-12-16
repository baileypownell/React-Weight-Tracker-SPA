import React from 'react';

export default class LineGraph extends React.Component {

  state = {
    graphTimePeriod: null
  }

  setGraphTimePeriod = (e) => {
    this.setState({
      graphTimePeriod: e.target.value
    })
  }

  componentDidMount() {
    var ctx = document.getElementById('myChart');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Pounds',
            data: [12, 19, 3, 5, 2, 3],
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
      <>
        <h2>Your weight over the past: </h2>
        <button value="week" onClick={this.setGraphTimePeriod} class="time-period">week</button>
        <button value="month" onClick={this.setGraphTimePeriod} class="time-period">month</button>
        <button value="year" onClick={this.setGraphTimePeriod} class="time-period">year</button>
        <canvas id="myChart" width="400" height="400"></canvas>
      </>
    )
  }
}
