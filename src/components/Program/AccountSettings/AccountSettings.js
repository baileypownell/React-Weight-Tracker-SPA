import React from 'react';

import ChangeName from './AccountActions/ChangeName';
import ChangeEmail from './AccountActions/ChangeEmail';
import ChangePassword from './AccountActions/ChangePassword';
import DeleteAccount from './AccountActions/DeleteAccount';

import './AccountSettings.scss';

const AccountSettings = () => {
  return (
    <div className="white-box" id="AccountSettings">
      <h2>Account Settings <i className="fas fa-cog"></i></h2>
      <div id="button-div">
        <ChangeName/>
        <ChangeEmail/>
        <ChangePassword/>
        <DeleteAccount/>
      </div>
    </div>
  )
}

export default AccountSettings;
