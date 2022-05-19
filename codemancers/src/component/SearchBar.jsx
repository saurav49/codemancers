import { useState, useEffect, useCallback } from "react";
import { GIPHY__API } from "../urls";
import axios from "axios";
import { usePost } from "../hooks/usePost";

const SearchBar = () => {
  const [textInpt, setTextInpt] = useState("");
  const [textInptError, setTextInptError] = useState("");
  const [selectedGif, setSelectedGif] = useState("");
  const [gifSearchText, setGifSearchText] = useState("");
  const [showGif, setShowGif] = useState(false);
  const [gifFetchLoading, setGifFetchLoading] = useState(false);
  const [gifQueryRes, setGifQueryRes] = useState([]);
  const { postList, setPostList } = usePost();

  useEffect(() => {
    handleSearchGiphyByQuery(gifSearchText || "cat");
  }, [gifSearchText]);

  const handleSearchGiphyByQuery = async (query) => {
    try {
      setGifFetchLoading(true);
      const { status, data } = await axios.get(
        `${GIPHY__API}&q=${query}&limit=10&offset=0&rating=g&lang=en`
      );
      if (status === 200) {
        setGifFetchLoading(false);
        setGifQueryRes(data.data);
      }
    } catch (error) {
      setGifFetchLoading(false);
      console.log(error);
    }
  };

  const debounce = (fn, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        fn(...args);
      }, delay);
    };
  };

  const handleGifSearchInput = (e) => {
    const { value } = e.target;
    setGifSearchText(value);
  };

  const optimizedDebounce = useCallback(
    debounce(handleGifSearchInput, 300),
    []
  );

  const handleUserSelectedGif = (url) => {
    setSelectedGif(url);
  };

  const checkFieldValidation = () => {
    let isValid;
    isValid = textInpt.length === 0 ? false : true;

    return isValid;
  };

  const handlePostSubmit = () => {
    if (!checkFieldValidation()) {
      setTextInptError("You have to write something to post");
      return;
    }
    setTextInptError("");
    selectedGif
      ? setPostList((prevState) => [
          ...prevState,
          {
            postText: textInpt,
            gif: selectedGif,
          },
        ])
      : setPostList((prevState) => [
          ...prevState,
          {
            postText: textInpt,
          },
        ]);
  };

  console.log(postList);

  return (
    <div className="w-[300px] border border-2 border-slate-200 rounded-sm my-0 mx-auto flex flex-col items-start justify-between relative">
      <textarea
        type="text"
        value={textInpt}
        onChange={(e) => setTextInpt(e.target.value)}
        className={`w-full border border-2 border-slate-400 p-1 rounded-sm`}
        placeholder="write something here"
      />
      {textInptError && <span className="text-red-400">{textInptError}</span>}
      {selectedGif && (
        <img
          src={selectedGif}
          alt="selectedGif"
          className="w-full m-1 self-center"
        />
      )}
      <button
        className="py-1 px-4 border border-2 border-slate-200 rounded-lg"
        onClick={() => setShowGif((prevState) => !prevState)}
      >
        GIF
      </button>
      <div className="flex flex-col">
        {showGif && (
          <input
            type="text"
            onChange={optimizedDebounce}
            className="border border-2 border-slate-400 p-1 rounded-sm"
            placeholder="Search GIF accross apps"
          />
        )}
        {showGif && (
          <div className="w-full h-[400px] overflow-y-auto border border-2 border-slate-400 rounded-md flex items-center flex-wrap">
            {!gifFetchLoading ? (
              <>
                {Array.isArray(gifQueryRes) &&
                  gifQueryRes.length > 0 &&
                  gifQueryRes.map(
                    ({
                      images: {
                        preview_gif: { url },
                      },
                      id,
                    }) => {
                      return (
                        <div
                          className="w-full m-1"
                          key={id}
                          onClick={() => handleUserSelectedGif(url)}
                        >
                          <img src={url} alt="gif" className="w-full" />
                        </div>
                      );
                    }
                  )}
              </>
            ) : (
              <p>loading...</p>
            )}
          </div>
        )}
      </div>
      <button
        onClick={handlePostSubmit}
        className="self-end bg-slate-500 hover:bg-slate-400 text-white font-bold py-3 px-10 border-b-4  border-slate-700 hover:border-slate-500 rounded uppercase"
      >
        post
      </button>
    </div>
  );
};

export { SearchBar };
