import React from 'react';


const Weight = (props) => (
  <div className="row" key={props.id}>
    <p>{props.weight}</p>
    <p>{props.date}</p>
  </div>
)

export default Weight;
