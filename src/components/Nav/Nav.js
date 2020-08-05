import React from 'react';
import { Link } from "react-router-dom";
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
//import * as actionTypes from '../store/actionTypes';
import * as actions from '../../store/actionCreators';
import { withRouter } from 'react-router-dom';


class Nav extends React.Component {

  logout = () => {
    this.props.logoutUser();
    this.props.history.push('/');
  }

  componentDidMount() {
    setTimeout(this.logout(), this.props.expiresIn);
  }

  render() {
    return (
        <nav>
          {/* { <Link to="/"><h1>Weight Tracker 2.0</h1></Link>
          <div>
            <Link to="/createAccount"><button>CREATE ACCOUNT</button></Link>
            {this.props.userLoggedIn ? <button onClick={this.logout}>LOG OUT</button> : <Link to="/logIn"><button>LOG IN</button></Link>} */}


      
            <Link to="/" >WeightTracker 2.0</Link>
            <i class="fas fa-bars"></i>
            {/* <ul class="left hide-on-med-and-down">
              <li><a href="sass.html"></a></li>
              <li><a href="badges.html">Components</a></li>
              <li class="active"><a href="collapsible.html">JavaScript</a></li>
            </ul> */}
   
        </nav>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logoutUser: () => dispatch(actions.logoutUserAsync())
  }
}

const mapStateToProps = state => {
  return {
    userLoggedIn: state.userLoggedIn,
    expiresIn: state.expiresIn
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Nav));
