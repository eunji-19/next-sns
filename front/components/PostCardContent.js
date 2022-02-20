import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const PostCardContent = ({ postData }) => {
  return (
    <div>
      {postData.split(/(#[^\s#]+)/g).map((value) => {
        if (value.match(/(#[^\s]+)/)) {
          return (
            <Link href={`/hashtag/${value.slice(1)}`}>
              <a>{value}</a>
            </Link>
          );
        }
        return value;
      })}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
