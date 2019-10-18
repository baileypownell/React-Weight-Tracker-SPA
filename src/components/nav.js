import React from 'react';

class Nav extends React.Component {
  render() {
    return (
      <div>
        <div>
        <h1>Weight Tracker 2.0</h1>
        </div>
        <div>
          <a href="#"><button>CREATE ACCOUNT</button></a>
          <a href="#"><button>LOG IN</button></a>
        </div>
      </div>
    )
  }
}

export default Nav;
