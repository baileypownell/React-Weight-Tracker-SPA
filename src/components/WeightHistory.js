import React from 'react';
import Weight from './Weight';
// imports for connecting this component to Redux state store
//import { connect } from 'react-redux';



// map each element of weightHistory to a div
class WeightHistory extends React.Component {
  render() {
    return (
      <Weight weight="120" date="11/12/2019" key="123456789"/>
      )
  }
}



export default WeightHistory;
