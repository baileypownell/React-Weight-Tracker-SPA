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
    }, 3000);

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

    graphData = () => {
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
      // just get data here... 
      const db = firebase.firestore();
      db.collection("users").doc(this.props.localId).get()
      .then((doc) => {
        let weightHistory = doc.data().weights;
          let sortedAllWeightsRecorded = weightHistory.sort(compare)
          if (this.state.graphTimePeriod === 'week') {
            let labels = [];
            let data = [];
            let newerThanAWeek = [];
            for (let i = 0; i < sortedAllWeightsRecorded.length-1; i++) {
                const now = new Date()
                const secondsSinceEpoch = Math.round(now.getTime() / 1000);
                let exactlyWeekAgo = secondsSinceEpoch - 604800;
                if (sortedAllWeightsRecorded[i].date.date.seconds > exactlyWeekAgo) {
                  newerThanAWeek.push(sortedAllWeightsRecorded[i]);
                }
              }
  
  
              newerThanAWeek.forEach((item) => {
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
          } else if (this.state.graphTimePeriod === 'month') {
              let labels = [];
              let data = [];
              let newerThanAMonth = [];
              for (let i = 0; i < sortedAllWeightsRecorded.length; i++) {
                  const now = new Date();
                  const secondsSinceEpoch = Math.round(now.getTime() / 1000);
                  let exactly30daysAgo = secondsSinceEpoch - 2592000;
                  if (sortedAllWeightsRecorded[i].date.date.seconds > exactly30daysAgo) {
                      newerThanAMonth.push(sortedAllWeightsRecorded[i]);
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
              for (let i = 0; i <= sortedAllWeightsRecorded.length-1; i++) {
                  const now = new Date()
                  const secondsSinceEpoch = Math.round(now.getTime() / 1000)
                  let exactly1yearAgo = secondsSinceEpoch - 31556952;
                  if (sortedAllWeightsRecorded[i].date.date.seconds > exactly1yearAgo) {
                      newerThanAYear.push(sortedAllWeightsRecorded[i]);
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
        })
        .catch(err => {
          console.log(err)
        })
    }

  render() {
    return (
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
        
          {!this.state.graphTimePeriod ? 
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
    localId: state.localId
  }
}

export default connect(mapStateToProps)(LineGraph);
