import { useContext } from "react";
import { PostContext } from "../context/postContext";

export const usePost = () => {
  return useContext(PostContext);
};
