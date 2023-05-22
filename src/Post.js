import React, { forwardRef } from "react";
import "./Post.css";
import { FaCheck } from "react-icons/fa";
import { RiChat3Line, RiRepeatLine, RiHeartLine } from "react-icons/ri";
import { BiUpload } from "react-icons/bi";
// import { Avatar } from "react-avatar";

const Post = forwardRef(
  ({ displayName, username, verified, text, image}, ref) => {
    return (
      <div className="post" ref={ref}>
        <div className="post__avatar">
          {/* <Avatar src={avatar} size="50" round /> */}
        </div>
        <div className="post__body">
          <div className="post__header">
            <div className="post__headerText">
              <h3>
                {displayName}{" "}
                <span className="post__headerSpecial">
                  {verified && <FaCheck className="post__badge" />} @
                  {username}
                </span>
              </h3>
            </div>
            <div className="post__headerDescription">
              <p>{text}</p>
            </div>
          </div>
          <img src={image} alt="" />
          <div className="post__footer">
            <RiChat3Line fontSize="20" />
            <RiRepeatLine fontSize="20" />
            <RiHeartLine fontSize="20" />
            <BiUpload fontSize="20" />
          </div>
        </div>
      </div>
    );
  }
);

export default Post;
