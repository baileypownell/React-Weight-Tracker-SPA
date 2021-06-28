import React from 'react'
import './RecentWeightLogs.scss';
import { Table } from 'evergreen-ui'
const { DateTime } = require("luxon")

const RecentWeightLogs = (props) => {
  const weights = props.weights.map(el => ({...el, 
    parsedDate: DateTime.fromSeconds(el.date.date.seconds).toLocaleString() 
  }))

  return (
    <div className="white-box">
    { weights.length ? 
      <Table>
        <Table.Head>
          <Table.TextHeaderCell>Weight</Table.TextHeaderCell>
          <Table.TextHeaderCell style={{'text-align': 'right'}}>Date</Table.TextHeaderCell>
        </Table.Head>
        <Table.Body height={240}>
          {weights.map((weightEntry, index) => (
            <Table.Row key={index} height={40}>
              <Table.TextCell>{weightEntry.weight}</Table.TextCell>
              <Table.TextCell style={{'text-align': 'right'}}>{weightEntry.parsedDate}</Table.TextCell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table> 
      : <p>Record a weight to start seeing your progress and setting goals.</p> }
    </div>
  )
}

export default RecentWeightLogs;
