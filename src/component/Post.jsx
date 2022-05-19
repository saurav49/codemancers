import React from "react";
import { usePost } from "../hooks/usePost";
const Post = ({ postText, gif, id }) => {
  const { setPostList } = usePost();

  const handleDeletePost = (postId) => {
    setPostList((prevState) => prevState.filter((post) => post._id !== postId));
  };
  return (
    <div className="w-[320px] h-[310px] flex flex-col items-start rounded-lg p-3 my-3 mx-1 bg-neutral-600 text-white shadow-md">
      <button
        onClick={() => handleDeletePost(id)}
        className="self-end rounded-full text-xs bg-neutral-500 p-1 hover:bg-neutral-400"
      >
        &#10006;
      </button>
      {postText && <p className="text-xl ml-1 mb-1">{postText}</p>}
      {gif && (
        <img src={gif} alt="gif" className="w-full h-[80%] rounded-lg my-2" />
      )}
    </div>
  );
};

export { Post };
