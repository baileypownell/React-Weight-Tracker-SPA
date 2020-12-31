import React from 'react';
// import for connecting this component to Redux state store
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RecentWeightLogs from './RecentWeightLogs/RecentWeightLogs';
import LineGraph from './LineGraph/LineGraph';
import WeightLogger from './WeightLogger/WeightLogger';

import './Program.scss';

export const Program = (props) => {
  return (
    <>
    { props.userLoggedIn ?
      <div className="dashboard z-depth-15">
          <h4>Hello, {props.firstName}</h4>
          <WeightLogger/>
          <div id="account-options">
            <RecentWeightLogs todaysWeight={props.todaysWeight} />
            <LineGraph/>
          </div>
      </div> 
      : 
      <Redirect to="/login" />
    }
    </>
  )
}

const mapStateToProps = state => {
  return {
    firstName: state.user.firstName,
    todaysWeight: state.todaysWeight,
    userLoggedIn: state.userLoggedIn,
  }
}

export default connect(mapStateToProps)(Program);
