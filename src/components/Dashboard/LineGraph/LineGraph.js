import React from 'react';
import './LineGraph.scss';
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
    }, 1000);

    this.setGraphTimePeriod('week')
  }

    setGraphTimePeriod = (e) => {
        this.setState({
          graphTimePeriod: e
        }, () => { this.graphData() })
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

    prepareChartData(num) {
      const { weights } = this.props
      if (!weights.length) {
        return
      } 
      let labels = [];
      let data = [];
      let newerThanTime = [];
      for (let i = 0; i < weights.length; i++) {
          const now = new Date()
          const secondsSinceEpoch = Math.round(now.getTime() / 1000);
          let timeLengthAgo = secondsSinceEpoch - num;
          if (weights[i].date.date.seconds > timeLengthAgo) {
            newerThanTime.push(weights[i]);
          }
      }

      newerThanTime.forEach((item) => {
          data.push(item.weight);
          let date = new Date(item.date.date.seconds * 1000);
          labels.push(date)
      })

      labels.reverse()
      data.reverse()

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
    }

    graphData = () => {
      const { graphTimePeriod } = this.state
      if (graphTimePeriod === 'week') {
        this.prepareChartData(604800)
      } else if (graphTimePeriod === 'month') {
        this.prepareChartData(2592000)
      } else if (graphTimePeriod === 'year') {
          this.prepareChartData(31556952)
      }
    }

  render() {
    return (   
      <>   
          { this.props.weights.length ? 
          <div className="white-box">
            <h6>Your weight over the past: </h6>
            <div>
              <ul className="tabs z-depth-1"
                  ref={Tabs => {
                  this.Tabs = Tabs;
                }}>
                  <li className="tab col s3"><a onClick={() => this.setGraphTimePeriod('week')} >Week</a></li>
                  <li className="tab col s3"><a onClick={() => this.setGraphTimePeriod('month')} >Month</a></li>
                  <li className="tab col s3"><a onClick={() => this.setGraphTimePeriod('year')} >Year</a></li>
              </ul>
            </div>
            <div id="canvas-parent">
              <canvas id="myChart" width="400" height="400"></canvas>
            </div>
          </div>
          : null
          }
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    localId: state.localId
  }
}

export default connect(mapStateToProps)(LineGraph);
