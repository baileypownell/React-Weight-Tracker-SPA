import React from 'react'
import AccountSettings from './AccountSettings/AccountSettings'
import firebase from '../../firebase-config'

class Settings extends React.Component {
  state = {
    user: null
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
          this.setState({
            user: user
          })
      } 
    });
}
    render() {
        return (
          <div id="mobile-center">
            <div className="content-parent">
              <h4>Settings</h4>
              <AccountSettings user={this.state.user}/>
            </div>
          </div>
        )
      }
}

export default Settings;