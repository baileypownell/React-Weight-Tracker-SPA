import React from 'react';

import ChangeName from './AccountActions/ChangeName';
import ChangeEmail from './AccountActions/ChangeEmail';
import ChangePassword from './AccountActions/ChangePassword';
import DeleteAccount from './AccountActions/DeleteAccount';
import M from 'materialize-css';
import './AccountSettings.scss';

class AccountSettings extends React.Component {

  componentDidMount() {
    var elems = document.querySelectorAll('.collapsible');
    M.Collapsible.init(elems, {});
  } 
  
  render() {
    return (
      <div className="white-box" id="accountSettings">
        <h6>Account Settings</h6>
        <div >
          {/* <ChangeName/>
          <ChangeEmail/>
          <ChangePassword/>
          <DeleteAccount/> */}
          <ul className="collapsible">
                <li>
                  <div className="collapsible-header">Update Name</div>
                  <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                </li>
                <li>
                  <div className="collapsible-header">Second</div>
                  <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                </li>
                <li>
                  <div className="collapsible-header">Third</div>
                  <div className="collapsible-body"><span>Lorem ipsum dolor sit amet.</span></div>
                </li>
              </ul>
        </div>
      </div>
    )
  }
  
}

export default AccountSettings;
