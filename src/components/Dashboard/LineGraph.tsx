import { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Box, Tab, Tabs, Typography } from '@mui/material'

enum TimePeriod {
  Week = 'week',
  Month = 'month', 
  Year = 'year',
}

let myChart

const LineGraph = (props: {weights: number[]}) => {
  const [value, setValue] = useState(0);
  const [noHistoryMessageDisplay, setNoHistoryMessageDisplay] = useState(false)
  const [graphTimePeriod, setGraphTimePeriod] = useState<TimePeriod | null>(null)

  useEffect(() => graphData(), [graphTimePeriod])

  useEffect(() => {
    setGraphTimePeriod(TimePeriod.Week)

    const data = {
      datasets: [{
          data: props.weights,
          backgroundColor: [
              '#B6C757',
          ],
          borderWidth: 1
      }]
    }

    const ctx = document.getElementById('myChart');
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
  }, [])

  const drawChart = (labels, filteredWeights) => {
    Chart.defaults.global.legend.display = false;
    let data = {
      labels: labels,
      datasets: [{
          label: 'Pounds',
          data: filteredWeights,
          backgroundColor: '#B6C757',
          hoverBackgroundColor: '#B6C757',
          borderColor: [
              '#e8ffb7'
          ],
          borderWidth: 2,
          spanGaps: true
      }]          
    }
    myChart.data.labels = data.labels
    myChart.data.datasets = data.datasets 

    myChart.update()
  }

  const prepareChartData = (num) => {
    const { weights } = props
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
    drawChart(labelsParsed, data) 
  }

  const graphData = (): void => {
    if (graphTimePeriod === TimePeriod.Week) {
      prepareChartData(604800)
    } else if (graphTimePeriod === TimePeriod.Month) {
      prepareChartData(2592000)
    } else if (graphTimePeriod === TimePeriod.Year) {
      prepareChartData(31556952)
    }
  }

  return (     
    <>
      { props.weights.length ? 
        <Box id="charts" sx={{ backgroundColor: 'white', boxShadow: 10 }} borderRadius={1} padding={2}>
          <Typography variant="overline" color='gray'>Your weight over the past</Typography>
          <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={value} onChange={(e, val) => setValue(val)}>
                <Tab onClick={() => setGraphTimePeriod(TimePeriod.Week)} sx={{ flexGrow: '1' }} label="Week" {...a11yProps(0)} />
                <Tab onClick={() => setGraphTimePeriod(TimePeriod.Month)} sx={{ flexGrow: '1' }} label="Month" {...a11yProps(1)} />
                <Tab onClick={() => setGraphTimePeriod(TimePeriod.Year)} sx={{ flexGrow: '1' }} label="Year" {...a11yProps(2)} />
              </Tabs>
            </Box>
          </Box>
          <Box sx={{
            position: 'relative',
            width: '100%',
            paddingTop: 1.5,
          }}>
            <canvas id="myChart" width="400" height="400"></canvas>
          </Box>
        </Box>
        : null }
    </>
  )
}

const mapStateToProps = state => {
  return {
    uid: state.uid
  }
}

export default connect(mapStateToProps)(LineGraph);

function a11yProps(index: number) {
  return {
    id: `tab-${index}`,
    'aria-controls': `tabpanel-${index}`,
  };
}