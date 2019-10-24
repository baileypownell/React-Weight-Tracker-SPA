import React from 'react';

import {Link} from "react-router-dom";


class Nav extends React.Component {
  render() {
    return (
        <nav>
          <Link to="/"><h1>Weight Tracker 2.0</h1></Link>
          <div>
            <Link to="/createAccount"><button>CREATE ACCOUNT</button></Link>
            <Link to="/logIn"><button>LOG IN</button></Link>
          </div>
        </nav>
    )
  }
}

export default Nav;
