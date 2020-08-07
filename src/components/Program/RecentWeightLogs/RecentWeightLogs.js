import React from 'react';
import WeightHistory from './WeightHistory/WeightHistory';

const RecentWeightLogs = () => {
  return (
    <div className="white-box">
      <h6>Recent Weight Logs <i className="fas fa-history"></i></h6>
      <div id="weightsHeader">
        <span>Weight</span>
        <span>Date</span>
      </div>
      <WeightHistory/>
    </div>
  )
}

export default RecentWeightLogs;
