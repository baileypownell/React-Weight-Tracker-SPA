import React from 'react';
import Weight from '../Weight/Weight';



class PriorRecords extends React.Component {
  render() {
    return (
      this.props.extraRecords.map((arrayEl) => {
        //console.log(arrayEl);
        return arrayEl.map((el) => {
          //console.log("el =", el)
          let date = (new Date(el.date.date.seconds * 1000)).toString();
          let dateStringArray = date.split(' ');
          let dateString = [dateStringArray[1], dateStringArray[2], dateStringArray[3]].join(' ');
          //console.log(el.date.date.seconds, el.weight, dateString)
          return <Weight
            key={el.date.date.seconds}
            weight={el.weight}
            date={dateString}
            />
        })
      })
    )
  }
}



export default PriorRecords
