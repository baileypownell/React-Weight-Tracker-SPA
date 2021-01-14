import React from 'react'
import './LogInOrSignUp.scss'
import CreateAccount from '../CreateAccount/CreateAccount'
import Login from '../LogIn/LogIn'


// class LogInOrSignUp extends React.Component {

//   render() {
//     return (
//       <div className="content-parent">
//         <Login/>
//         <div id="OR">
//           <h2>OR</h2>
//         </div>
//         <CreateAccount/>
//       </div>
//     )
//   }
// }

const LogInOrSignUp = () => {
  return (
    <div className="content-parent">
       <Login/>
       <div id="OR">
           <h2>OR</h2>
        </div>
      <CreateAccount/>
   </div>
  )
}

export default LogInOrSignUp;
