import React from 'react';
import { Link } from "react-router-dom";
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../store/actionTypes';

import { withRouter } from 'react-router-dom';


class Nav extends React.Component {

  logoutUser = () => {
    firebase.auth().signOut().then(() => {
      this.props.setLoginStatusFalse();
      this.props.history.push('/');
    })
  }

  render() {
    return (
        <nav>
          <Link to="/"><h1>Weight Tracker 2.0</h1></Link>
          <div>
            <Link to="/createAccount"><button>CREATE ACCOUNT</button></Link>
            {this.props.userLoggedIn ? <button onClick={this.logoutUser}>LOG OUT</button> : <Link to="/logIn"><button>LOG IN</button></Link>}

          </div>
        </nav>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoginStatusFalse: () => dispatch({type: actionTypes.SET_USER_LOGGED_OUT})
  }
}

const mapStateToProps = state => {
  return {
    userLoggedIn: state.userLoggedIn
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Nav));
