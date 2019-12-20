import React from 'react';
import './LineGraph.scss';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';


class LineGraph extends React.Component {

  state = {
      graphTimePeriod: 'week',
      labels: [],
      data: []
  }

    setGraphTimePeriod = (e) => {
        // use this if statement so that componentDidMount() can run
        if (e) {
            this.setState({
                graphTimePeriod: e.target.value
            }, () => { this.graphData() } )
        } else {
            this.graphData();
        }
    }

    drawChart = () => {
        var ctx = document.getElementById('myChart');
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.state.labels,
                datasets: [{
                    label: 'Pounds',
                    data: this.state.data,
                    backgroundColor: 'rgb(38, 232, 232)',
                    hoverBackgroundColor: 'rgba(0, 0, 0, 0)',
                    borderColor: [
                        'rgb(94, 244, 86)'
                    ],
                    borderWidth: 2,
                    spanGaps: true
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

    graphData = () => {
        if (this.state.graphTimePeriod === 'week') {
            let labels = [];
            let data = [];
            let newerThanAWeek = [];
            for (let i = 0; i < this.props.entireSortedWeightHistory.length-1; i++) {
                const now = new Date()
                const secondsSinceEpoch = Math.round(now.getTime() / 1000);
                let exactlyWeekAgo = secondsSinceEpoch - 604800;
                if (this.props.entireSortedWeightHistory[i].date.date.seconds > exactlyWeekAgo) {
                    newerThanAWeek.push(this.props.entireSortedWeightHistory[i]);
                } else {
                    return;
                }
            }
            console.log(newerThanAWeek)
            newerThanAWeek.forEach((item) => {
                data.push(item.weight);
                let date = new Date(item.date.date.seconds * 1000);
                labels.push(date)
            })

            labels.reverse();
            data.reverse();
            
            let labelsParsed = [];
            labels.forEach(date => {
                let day = date.toUTCString().split(' ')[1];
                let month = date.toUTCString().split(' ')[2];
                let fulldate = [month, day].join(' ');
                labelsParsed.push(fulldate);
            })   
            this.setState({
                labels: labelsParsed,
                data: data
            }, () => { this.drawChart() });
        } else if (this.state.graphTimePeriod === 'month') {
            console.log("the time period is month")
            let labels = [];
            let data = [];
            let newerThanAMonth = [];
            console.log("length of props is: ", this.props.entireSortedWeightHistory.length)
            for (let i = 0; i < this.props.entireSortedWeightHistory.length; i++) {
                console.log(this.props.entireSortedWeightHistory[i])
                const now = new Date()
                const secondsSinceEpoch = Math.round(now.getTime() / 1000);
                let exactly30daysAgo = secondsSinceEpoch - 2592000;
                if (this.props.entireSortedWeightHistory[i].date.date.seconds > exactly30daysAgo) {
                    newerThanAMonth.push(this.props.entireSortedWeightHistory[i]);
                } else {
                    return;
                }
            }

            newerThanAMonth.forEach((item) => {
                data.push(item.weight);
                let date = new Date(item.date.date.seconds * 1000);
                labels.push(date);
            })

            labels.reverse();
            data.reverse();

            let labelsParsed = [];
            labels.forEach(date => {
                let day = date.toUTCString().split(' ')[1];
                let month = date.toUTCString().split(' ')[2];
                let fulldate = [month, day].join(' ');
                labelsParsed.push(fulldate);
            })
            this.setState({
                labels: labelsParsed,
                data: data
            }, () => { this.drawChart() });
        } else if (this.state.graphTimePeriod === 'year') {
            console.log("the time period is year")
            let labels = [];
            let labelsParsed = [];
            let data = [];
            let newerThanAYear = [];
            for (let i = 0; i <= this.props.entireSortedWeightHistory.length-1; i++) {
                const now = new Date()
                const secondsSinceEpoch = Math.round(now.getTime() / 1000)
                let exactly1yearAgo = secondsSinceEpoch - 31556952;
                if (this.props.entireSortedWeightHistory[i].date.date.seconds > exactly1yearAgo) {
                    newerThanAYear.push(this.props.entireSortedWeightHistory[i]);
                }
            }


            newerThanAYear.forEach((item) => {
                data.push(item.weight);
                let date = new Date(item.date.date.seconds * 1000);
                labels.push(date);
            })

            labels.reverse();
            data.reverse();

            labels.forEach(date => {
                let day = date.toUTCString().split(' ')[1];
                let month = date.toUTCString().split(' ')[2];
                let fullDate = [month, day].join(' ');
                labelsParsed.push(fullDate);
            })
 
            this.setState({
                labels: labelsParsed,
                data: data
            }, () => this.drawChart())
        }       
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
