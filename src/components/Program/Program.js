import React from 'react';

import Content from '../Content/Content';
// import for connecting this component to Redux state store
import { connect } from 'react-redux';



import RecentWeightLogs from './RecentWeightLogs/RecentWeightLogs';
import AccountSettings from './AccountSettings/AccountSettings';
import LineGraph from './LineGraph/LineGraph';
import WeightLogger from './WeightLogger/WeightLogger';

import './Program.scss';

export const Program = (props) => {
  return (
    <Content>
      <h1 id="greeting">Hello, {props.firstName}</h1>
      <WeightLogger/>
      <div id="account-options">
        <RecentWeightLogs todaysWeight={props.todaysWeight} />
        <LineGraph/>
        <AccountSettings/>
      </div>
    </Content>
  )
}

const mapStateToProps = state => {
  return {
    firstName: state.user.firstName,
    todaysWeight: state.todaysWeight
  }
}

export default connect(mapStateToProps)(Program);
