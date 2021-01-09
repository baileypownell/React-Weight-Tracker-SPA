import React from 'react'
import AccountSettings from './AccountSettings/AccountSettings'

class Settings extends React.Component {
    render() {
        return (
          <div id="mobile-center">
            <div className="content-parent">
              <h4>Settings</h4>
              <AccountSettings/>
            </div>
          </div>
        )
      }
}

export default Settings;