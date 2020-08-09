import React from 'react';


const Weight = (props) => (
  <div className="row" key={props.index}>
    <p>{props.weight}</p>
    <p className="right">{props.date}</p>
  </div>
)

export default Weight;
