import { Box, Tab, Tabs, useTheme } from '@mui/material'
import { Chart } from 'chart.js/auto'
import { DateTime } from 'luxon'
import { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import LegacyWeight from '../../types/legacy-weight'
import Weight from '../../types/weight'

enum TimePeriod {
  Week = 'week',
  Month = 'month', 
  Year = 'year',
}

let lineChart

const LineGraph = (props: {weights: (Weight | LegacyWeight)[]}) => {
  const [value, setValue] = useState(0);
  const [graphTimePeriod, setGraphTimePeriod] = useState<TimePeriod>(TimePeriod.Week)
  const theme = useTheme()
  const ref = useRef<any>()

  useEffect(() => {
    if (!props.weights.length) {
      return 
    }

    graphData()
  }, [props.weights, graphTimePeriod])

  const drawChart = (labels: string[], filteredWeights: number[]) => {
    const data = {
      labels: labels,
      datasets: [{
          label: `Your weight over the past ${graphTimePeriod}`,
          data: filteredWeights,
          backgroundColor: theme.palette.secondary.main,
          hoverBackgroundColor: theme.palette.primary.light,
          borderColor: [
            theme.palette.secondary.dark,
          ],
          borderWidth: 2,
          spanGaps: true
      }]          
    }

    lineChart?.destroy()
    lineChart = new Chart(ref.current, {
      type: 'line', 
      data, 
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grace: 10
          }
        }
      }
    })
  }

  const prepareChartData = (secondsInTimePeriod: number) => {
    const { weights } = props
    const now = new Date()
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);
    const timeLengthAgo = secondsSinceEpoch - secondsInTimePeriod;
    const newerThanTime: (Weight | LegacyWeight)[] = weights.filter((weightEntry) => {
        const weightRecordedDateInSeconds = (weightEntry as LegacyWeight).date.date ? 
          (weightEntry as LegacyWeight).date.date.seconds : 
          DateTime.fromMillis((weightEntry as Weight).date).toSeconds()

        return weightRecordedDateInSeconds > timeLengthAgo
    })

    const { labels, data} = newerThanTime.reduce((acc: { labels: string[], data: number[] }, item) => {
      acc.data.push(Number(item.weight));
      const date = (item as LegacyWeight).date.date ?
          DateTime.fromSeconds((item as LegacyWeight).date.date.seconds) :
          DateTime.fromMillis((item as Weight).date)
      acc.labels.push(date.toLocaleString(DateTime.DATE_MED))

      return acc
    }, {
      labels: [],
      data: [],
    })

    labels.reverse()
    data.reverse()

    drawChart(labels, data)
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

  if (!props.weights.length) {
    return (
      null
    )
  }

  return (     
    <Box sx={{ backgroundColor: theme.palette.white.main, boxShadow: 10 }} borderRadius={1} padding={2}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          sx={{ 
            button: {
              color: theme.palette.gray.main
            } 
          }} 
          value={value} 
          onChange={(e, val) => setValue(val)}>
          <Tab color="" onClick={() => setGraphTimePeriod(TimePeriod.Week)} sx={{ flexGrow: '1' }} label="Week" {...a11yProps(0)} />
          <Tab onClick={() => setGraphTimePeriod(TimePeriod.Month)} sx={{ flexGrow: '1' }} label="Month" {...a11yProps(1)} />
          <Tab onClick={() => setGraphTimePeriod(TimePeriod.Year)} sx={{ flexGrow: '1' }} label="Year" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <Box sx={{
        position: 'relative',
        width: '100%',
        paddingTop: 1.5,
      }}>
        <canvas ref={ref} width="400" height="400"></canvas>
      </Box>
    </Box>
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