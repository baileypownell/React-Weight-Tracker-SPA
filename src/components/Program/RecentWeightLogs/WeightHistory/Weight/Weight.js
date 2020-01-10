import React from 'react';


const Weight = (props) => (
  <div className="row" key={props.key}>
    <p>{props.weight}</p>
    <p>{props.date}</p>
  </div>
)

export default Weight;
