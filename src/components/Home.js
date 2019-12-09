import React from 'react';
import Content from './Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../store/actionTypes';


class Home extends React.Component {

  directUser = () => {
    if (this.props.userLoggedIn) {
      this.props.history.replace('/Program');
    } else {
      this.props.history.replace('/LogInOrSignUp');
    }
  }

  render() {
    return (
      <Content>
        <h1>It's never been <br/><span id="fancy">easier</span><br/> to track your progress</h1>
        <button onClick={this.directUser}>LOG YOUR WEIGHT <i class="fas fa-weight"></i></button>
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
