import "./App.css";
import { CreatePost, PostList } from "./component/index";
import { useState } from "react";

function App() {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="bg-stone-700 text-center min-h-screen w-screen pt-5">
      <button
        className="rounded-3xl border border-gray-200 py-3 px-8 my-3 bg-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-100"
        onClick={() => setShowModal(true)}
      >
        Whats on your mind?
      </button>
      {showModal && <CreatePost setShowModal={setShowModal} />}
      <PostList />
    </div>
  );
}

export default App;
