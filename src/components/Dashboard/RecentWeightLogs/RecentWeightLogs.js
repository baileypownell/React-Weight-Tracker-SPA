import React from 'react'
import './RecentWeightLogs.scss'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
const { DateTime } = require("luxon")

const RecentWeightLogs = (props) => {
  const weights = props.weights.map(el => ({...el, 
    parsedDate: DateTime.fromSeconds(el.date.date.seconds).toLocaleString() 
  }))

  return (
    <div className="white-box" style={{'height': '470px'}}>
    { weights.length ? 
      <TableContainer component={Paper}>
      <Table>
        <TableHead id="weightsHeader">
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Weight <span>(lbs)</span></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {weights.map((weightEntry, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                {weightEntry.parsedDate}
              </TableCell>
              <TableCell align="right">{ Number(weightEntry.weight).toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      : <p>Record a weight to start seeing your progress and setting goals.</p> }
    </div>
  )
}

export default RecentWeightLogs;
