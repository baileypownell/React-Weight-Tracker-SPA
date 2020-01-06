import React from 'react';
import Weight from '../Weight/Weight';

const PriorRecords = (props) => (
  props.extraRecords.map((array) => {
    for (let i = 0; i < array.length; i++) {
      let date = (new Date(array[i].date.date.seconds * 1000)).toString();
      let dateStringArray = date.split(' ');
      let dateString = [dateStringArray[1], dateStringArray[2], dateStringArray[3]].join(' ');
      return <Weight
        id={array[i].date.date.seconds}
        weight={array[i].weight}
        date={dateString}
        />
    }

   })
)

export default PriorRecords
