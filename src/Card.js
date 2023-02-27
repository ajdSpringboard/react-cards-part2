import React from "react";

const Card = ({ suit, value }) => (
  <div className="card">
    <p>
      {value} of {suit}
    </p>
  </div>
);

export default Card;
