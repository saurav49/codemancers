import React from "react";
import { usePost } from "../hooks/usePost";
import { Post } from "./index";

const PostList = () => {
  const { postList } = usePost();

  return (
    <div className="w-full my-2 flex items-center justify-evenly flex-wrap">
      {Array.isArray(postList) && postList.length > 0 ? (
        postList.map(({ postText, gif, _id }) => {
          return <Post postText={postText} gif={gif} key={_id} id={_id} />;
        })
      ) : (
        <p className="text-white text-2xl mt-10 italic">
          Your feed looks empty
        </p>
      )}
    </div>
  );
};

export { PostList };
