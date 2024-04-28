import React from "react";
import tagData from "../data/tags.json";

const PostFeed = (props) => {

  console.log(props.tags);

  const tagStyles = tagData.reduce((acc, tag) => {
    acc[tag.tagName] = { backgroundColor: tag.backgroundColor, textColor: tag.textColor };
    return acc;
  }, {});

  return (
    <a href={`/details/${props.id}`}>
      <div className="post-container">
        <div className="post-header">
          <h3>{props.userID}</h3>
          <h4>Posted {props.time}</h4>

          <div className="post-tags">
            {props.tags && props.tags.map((tag, index) => {
              const style = tagStyles[tag] || {};  // Default to an empty object if the tag is not found

              return (
                <span
                  key={index}
                  className="tag"
                  style={{ backgroundColor: style.backgroundColor, color: style.textColor }}
                >
                  {tag}
                </span>
              );
            })}
          </div>

        </div>
        <div className="post-content">
          <h2>{props.title}</h2>
          {props.img_url && <img src={props.img_url} alt="post" />}
          
        </div>
        <div className="post-footer">
          <p>Upvotes: {props.upvoteCount}</p>
        </div>
      </div>
    </a>
  );
};

export default PostFeed;
