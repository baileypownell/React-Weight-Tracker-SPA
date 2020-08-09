import React from 'react';
import './LineGraph.scss';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import M from 'materialize-css';

class LineGraph extends React.Component {

  state = {
      labels: [],
      data: [],
      noHistoryMessageDisplay: false,
      graphTimePeriod: null
  }

  componentDidMount() {

    let el = document.querySelector('.tabs')
    setTimeout(() => {
      M.Tabs.init(el);
    }, 3000);
  }

    setGraphTimePeriod = (e) => {
        // use this if statement so that componentDidMount() can run
        if (this.props.entireSortedWeightHistory.length < 2 ) {
          return;
        }
        if (e) {
          this.setState({
            graphTimePeriod: e
          }, () => { this.graphData() } )
        } else {
            this.graphData();
        }
    }

    drawChart = () => {
        var ctx = document.getElementById('myChart');
        Chart.defaults.global.legend.display = false;
        var myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.state.labels,
                datasets: [{
                    label: 'Pounds',
                    data: this.state.data,
                    backgroundColor: '#f79c40',
                    hoverBackgroundColor: '#f79c40',
                    borderColor: [
                        '#f79c40'
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
              }
            }

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
            let labels = [];
            let data = [];
            let newerThanAMonth = [];
            for (let i = 0; i < this.props.entireSortedWeightHistory.length; i++) {
                const now = new Date();
                const secondsSinceEpoch = Math.round(now.getTime() / 1000);
                let exactly30daysAgo = secondsSinceEpoch - 2592000;
                if (this.props.entireSortedWeightHistory[i].date.date.seconds > exactly30daysAgo) {
                    newerThanAMonth.push(this.props.entireSortedWeightHistory[i]);
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

  render() {
    return (
      <div className="white-box">
        <h6>Your weight over the past: </h6>
        <div>
          <ul className="tabs z-depth-1 tabs-fixed-width"
              ref={Tabs => {
              this.Tabs = Tabs;
            }}>
              <li className="tab col s3"><a onClick={() => this.setGraphTimePeriod('week')} tabs-fixed-width="true">Week</a></li>
              <li className="tab col s3"><a onClick={() => this.setGraphTimePeriod('month')} tabs-fixed-width="true">Month</a></li>
              <li className="tab col s3"><a onClick={() => this.setGraphTimePeriod('year')} tabs-fixed-width="true">Year</a></li>
          </ul>
        </div>
          {this.state.graphTimePeriod === null ? 
            <div className="noData">
              <p>You haven't recorded any or enough weights yet to graph.</p> 
            </div>
          :
            <div id="canvas-parent">
              <canvas id="myChart" width="400" height="400"></canvas>
            </div>
          }
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
