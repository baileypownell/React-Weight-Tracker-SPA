import React from 'react'
import { connect } from 'react-redux'
import './Home.scss'


class Home extends React.Component {

  directUser = () => {
    if (this.props.userLoggedIn) {
      this.props.history.replace('/dashboard');
    } else {
      this.props.history.replace('/login');
    }
  }

  render() {
    return (
      <div id="mobile-center">
        <div className="content-parent">
          <h5>It's never been <br/><span id="fancy">easier</span><br/> to track your progress.</h5>

          <div id="features">
            <p id="logo-font">happy balance</p>
            <ul>
              <li>is simple to use <i class="fas fa-check-circle"></i></li>
              <li>enables you to set goals for yourself <i class="fas fa-check-circle"></i></li>
              <li>and most importantly, is completely <span id="tiny">free</span> <i class="fas fa-check-circle"></i></li>
            </ul>
          </div>
          

          <button 
            className="waves-effect waves-light btn" 
            onClick={this.directUser}>get started</button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userLoggedIn: state.userLoggedIn
  }
}

export default connect(mapStateToProps)(Home);
