import React from "react";
import classNames from "classnames";
import './nlp.css'
function PostSentiment(props) {
    const { sentiment } = props;
    console.log(sentiment);
  const sentimentClassName = classNames("sentiment", {
   
    positive: sentiment === "+",
    negative: sentiment === "-",
    neutral: sentiment === "0",
  });

  return <p className={sentimentClassName}>{sentiment}</p>;
}

export default PostSentiment;
