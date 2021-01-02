import React from 'react';
import './Weight.scss';

const Weight = (props) => (
  <div className="row" key={props.index}>
    <p>{props.weight}</p>
    <p className="right">{props.date}</p>
  </div>
)

export default Weight;
