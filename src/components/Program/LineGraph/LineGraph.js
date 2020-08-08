import React from 'react';
import './LineGraph.scss';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import M from 'materialize-css';

class LineGraph extends React.Component {

  state = {
      graphTimePeriod: '',
      labels: [],
      data: [],
      noHistoryMessageDisplay: false
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
          this.setState({
            noHistoryMessageDisplay: true
          })
          return;
        }
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
        Chart.defaults.global.legend.display = false;
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
              <li className="tab col s3"><a onClick={this.setGraphTimePeriod}>Week</a></li>
              <li className="tab col s3"><a tabs-fixed-width>Month</a></li>
              <li className="tab col s3 disabled"><a tabs-fixed-width>Year</a></li>
          </ul>
        </div>
          {this.state.graphTimePeriod === '' ? null :
            <div id="canvas-parent">
              <canvas id="myChart" width="400" height="400"></canvas>
            </div>
          }
          {this.state.noHistoryMessageDisplay ? <p>You haven't recorded any or enough weights yet to graph.</p> : null}
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
