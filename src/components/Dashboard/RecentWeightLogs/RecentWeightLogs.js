import React from 'react';
import WeightHistory from './WeightHistory/WeightHistory';
import './RecentWeightLogs.scss';

const RecentWeightLogs = (props) => {
  return (
    <div className="white-box">
      <h6>Recent Weight Logs</h6>
      { props.weights.length ? 
        <>
          <div id="weightsHeader">
            <span>Weight</span>
            <span>Date</span>
          </div>
          <WeightHistory 
            key={props.weights}  
            weights={props.weights}/>
        </> : 
      <p>You haven't recorded any weights.</p> }
    </div>
  )
}

export default RecentWeightLogs;
