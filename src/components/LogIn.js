import React from 'react';
import Content from './Content';

export default function LogIn() {
  return (
    <Content>
      <h1>LOG IN</h1>
      <form>
        <label><h2>Email:</h2></label>
        <input type="email" name="email">
        </input>
        <label><h2>Password:</h2></label>
        <input type="text" name="password">
        </input>
        <button>LOG IN <i class="fas fa-arrow-circle-right"></i></button>
      </form>
    </Content>
  )
}
