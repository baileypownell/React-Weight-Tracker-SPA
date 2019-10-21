import React from 'react';
import Content from './Content';

export default function CreateAccount() {
  return <Content>
    <h1>CREATE AN ACCOUNT</h1>
    <form>
      <label><h2>First Name:</h2></label>
      <input type="text" name="first_name">
      </input>
      <label><h2>Last Name:</h2></label>
      <input type="text" name="last_name">
      </input>
      <label><h2>Email:</h2></label>
      <input type="email" name="email">
      </input>
      <button>SIGN UP <i class="fas fa-arrow-circle-right"></i></button>
    </form>
  </Content>
}
