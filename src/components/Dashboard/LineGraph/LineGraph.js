import React from 'react'
import './LineGraph.scss'
import { connect } from 'react-redux'
import M from 'materialize-css'
import { filter } from 'async'

let myChart

class LineGraph extends React.Component {

  state = {
      noHistoryMessageDisplay: false,
      graphTimePeriod: '',
  }

  componentDidMount() {

    let el = document.querySelector('.tabs')
    setTimeout(() => {
      M.Tabs.init(el);
    }, 1000);

    this.setGraphTimePeriod('week')

    let data = {
      datasets: [{
          data: this.props.weights,
          backgroundColor: [
              '#f79c40',
          ],
          borderWidth: 1
      }]
  }

    var ctx = document.getElementById('myChart');
    myChart = new Chart(ctx, {
      type: 'line', 
      data, 
      options: {
          scales: {
              yAxes: [{
                  ticks: {
                      beginAtZero: true
                  }
              }]
          }
      }
    })
  }

  setGraphTimePeriod = (e) => {
    this.setState({
      graphTimePeriod: e
    }, () => { this.graphData() })
  }

  componentDidUpdate(prevProps) {
    let graphTimePeriod = this.state.graphTimePeriod
    if (graphTimePeriod === 'week') {
      this.prepareChartData(604800)
    } else if (graphTimePeriod === 'month') {
      this.prepareChartData(2592000)
    } else if (graphTimePeriod === 'year') {
      this.prepareChartData(31556952)
    }
  }

  drawChart = (labels, filteredWeights) => {
    Chart.defaults.global.legend.display = false;
    let data = {
      labels: labels,
      datasets: [{
          label: 'Pounds',
          data: filteredWeights,
          backgroundColor: '#f79c40',
          hoverBackgroundColor: '#f79c40',
          borderColor: [
              '#f79c40'
          ],
          borderWidth: 2,
          spanGaps: true
      }]          
    }
    myChart.data.labels = data.labels
    myChart.data.datasets = data.datasets 

    myChart.update()
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
      this.drawChart(labelsParsed, data) 
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
      <div id="line-graph">   
          { this.props.weights.length ? 
          <div className="white-box" id="charts">
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
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    localId: state.localId
  }
}

export default connect(mapStateToProps)(LineGraph);
