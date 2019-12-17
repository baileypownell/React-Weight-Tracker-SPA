import React from 'react';
import WeightHistory from './WeightHistory/WeightHistory';

class RecentWeightLogs extends React.Component {

  render() {
    return (
      <div>
        <div id="weight-history">
          <h2>Recent Weight Logs <i className="fas fa-history"></i></h2>
          <div id="header">
            <span>Weight</span>
            <span>Date</span>
          </div>
          <WeightHistory/>
        </div>
      </div>
    )
  }
}

export default RecentWeightLogs;
