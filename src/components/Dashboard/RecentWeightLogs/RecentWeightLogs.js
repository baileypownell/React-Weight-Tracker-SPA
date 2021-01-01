import React from 'react';
import WeightHistory from './WeightHistory/WeightHistory';

const RecentWeightLogs = (props) => {
  return (
    <div className="white-box">
      <h6>Recent Weight Logs</h6>
      <div id="weightsHeader">
        <span>Weight</span>
        <span>Date</span>
      </div>
      {props.weights ? <WeightHistory key={props.weights}  weights={props.weights}/> : null}
    </div>
  )
}

export default RecentWeightLogs;
