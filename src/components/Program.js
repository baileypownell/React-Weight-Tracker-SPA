import React from 'react';
import Content from './Content';
// imports for connecting this component to Redux state store
import { connect } from 'react-redux';
import * as actionTypes from '../store/actions';

class Program extends React.Component {
  render() {
    return (
      <Content>
        <h1>Hello, {this.props.firstName}</h1>
        <div>
          <h2>Record Weight <i class="fas fa-pencil-alt"></i></h2>
          <form>
          <input type="text"></input>
          <button>LOG WEIGHT</button>
          </form>
        </div>
        <div>
          <h2>Recent Weight Logs <i class="fas fa-history"></i></h2>
          <button>VIEW MY ENTIRE HISTORY</button>
        </div>
        <div>
          <h2>Account Settings <i class="fas fa-cog"></i></h2>
          <button>CHANGE MY NAME</button>
          <button>CHANGE MY EMAIL</button>
          <button>CHANGE MY PASSWORD</button>
        </div>
      </Content>
    )
  }
}

const mapStateToProps = state => {
  return {
    firstName: state.user.firstName
  }
}

export default connect(mapStateToProps)(Program);
