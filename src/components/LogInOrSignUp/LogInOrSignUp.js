import React from 'react';
import Content from '../Content/Content';
import LogIn from '../LogIn/LogIn';
import CreateAccount from '../CreateAccount/CreateAccount';
import './LogInOrSignUp.scss';


class LogInOrSignUp extends React.Component {
  render() {
    return (
      <div className="login">
        <div>
          <LogIn/>
        </div>
        <div id="OR">
        <h2>OR</h2>
        </div>
        <div>
          <CreateAccount/>
        </div>
      </div>
    )
  }
}

export default LogInOrSignUp;
