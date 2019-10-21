import React from 'react';

export default class Content extends React.Component {
  render() {
    return (
      <div id="ui">
      {this.props.children}
      </div>
    )
  }
}
