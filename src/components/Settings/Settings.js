import React from 'react'
import AccountSettings from './AccountSettings/AccountSettings'

class Settings extends React.Component {
    render() {
        return (
          <div className="content-parent">
            <h4>Settings</h4>
            <AccountSettings/>
          </div>
        )
      }
}

export default Settings;