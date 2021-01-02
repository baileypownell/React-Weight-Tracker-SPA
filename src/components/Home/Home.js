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
      <div className="content-parent">
        <h5>It's never been <br/><span id="fancy">easier</span><br/> to track your progress.</h5>
        <button 
          className="waves-effect waves-light btn" 
          onClick={this.directUser}>get started</button>
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
