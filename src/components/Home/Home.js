import React from 'react';
import Content from '../Content/Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actionTypes';

import './Home.scss';


class Home extends React.Component {

  directUser = () => {
    if (this.props.userLoggedIn) {
      this.props.history.replace('/dashboard');
    } else {
      this.props.history.replace('/auth');
    }
  }

  render() {
    return (
      <Content>
        <h5>It's never been <br/><span id="fancy">easier</span><br/> to track your progress.</h5>
        <button 
          className="waves-effect waves-light btn" 
          onClick={this.directUser}>get started</button>
      </Content>
    )
  }
}

const mapStateToProps = state => {
  return {
    userLoggedIn: state.userLoggedIn
  }
}

export default connect(mapStateToProps)(Home);
