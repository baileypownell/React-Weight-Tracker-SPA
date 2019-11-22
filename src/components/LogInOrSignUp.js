import React from 'react';
import LogIn from './LogIn';
import CreateAccount from './CreateAccount';



class LogInOrSignUp extends React.Component {
  render() {
    return (
      <div id="directUser">
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
