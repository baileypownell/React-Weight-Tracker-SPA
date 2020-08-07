import React from 'react';
import { Link } from "react-router-dom";
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
//import * as actionTypes from '../store/actionTypes';
import * as actions from '../../store/actionCreators';
import { withRouter } from 'react-router-dom';
import M from 'materialize-css';

class Nav extends React.Component {

  logout = () => {
    this.props.logoutUser();
    this.props.history.push('/');
  }

  componentDidMount() {
    //setTimeout(this.logout(), this.props.expiresIn);
    // use a sidenav
    var elems = document.querySelectorAll('.sidenav');
    console.log(elems)
    M.Sidenav.init(elems, { edge: 'right'});
  }

  render() {
    return (
      <>
        <nav>      
            <Link to="/" >WeightTracker 2.0</Link>
            <a href="#" data-target="slide-out" className="sidenav-trigger"><i className="fas fa-bars"></i></a>
            
            {/* <ul class="left hide-on-med-and-down">
              <li><a href="sass.html"></a></li>
              <li><a href="badges.html">Components</a></li>
              <li class="active"><a href="collapsible.html">JavaScript</a></li>
            </ul> */}
   
        </nav>
            <ul id="slide-out" className="sidenav">
                <li><Link to="/createAccount">Create Account</Link></li>
                <li><Link to="/logIn">Login</Link></li>
                <li><a href="#!">Log Out</a></li>
                <li><div className="divider"></div></li>
            </ul>         
        </>
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
