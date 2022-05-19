import { useState, useEffect, useCallback } from "react";
import { GIPHY__API } from "../urls";
import axios from "axios";
import { usePost } from "../hooks/usePost";
import loader from "../assets/loader.gif";
import { v4 as uuidv4 } from "uuid";

const CreatePost = ({ setShowModal }) => {
  const [textInpt, setTextInpt] = useState("");
  const [textInptError, setTextInptError] = useState("");
  const [selectedGif, setSelectedGif] = useState("");
  const [showGif, setShowGif] = useState(false);
  const [gifFetchLoading, setGifFetchLoading] = useState(false);
  const [gifQueryRes, setGifQueryRes] = useState([]);
  const { setPostList } = usePost();

  useEffect(() => {
    (async function () {
      try {
        setGifFetchLoading(true);
        const { status, data } = await axios.get(
          `${GIPHY__API}&q=cat&limit=10&offset=0&rating=g&lang=en`
        );
        if (status === 200) {
          setGifFetchLoading(false);
          setGifQueryRes(data.data);
        }
      } catch (error) {
        setGifFetchLoading(false);
        console.log(error);
      }
    })();
  }, []);

  const handleGifSearchInput = async (e) => {
    const query = e.target.value || "cat";
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
            _id: uuidv4(),
            postText: textInpt,
            gif: selectedGif,
          },
        ])
      : setPostList((prevState) => [
          ...prevState,
          {
            _id: uuidv4(),
            postText: textInpt,
          },
        ]);
    setTextInpt("");
    setSelectedGif("");
    setShowModal(false);
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-neutral-900/70">
      <div className="z-50 w-[400px] flex flex-col items-center bg-neutral-700 rounded-lg shadow-sm border border-neutral-500 ">
        <div className="flex items-center justify-center w-full relative mb-3 mt-2 px-3 pt-1 pb-3 border-b-2">
          <h1 className="font-bold text-white text-2xl">Create post</h1>
          <button
            className="absolute right-3 rounded-full bg-neutral-600 p-1 hover:bg-neutral-500"
            onClick={() => setShowModal(false)}
          >
            &#10006;
          </button>
        </div>
        <div className=" w-full rounded-md my-0 mx-auto flex flex-col items-start justify-between relative shadow-sm py-2 px-4">
          <textarea
            type="text"
            value={textInpt}
            onChange={(e) => setTextInpt(e.target.value)}
            className="w-full border-none p-2 mb-1 bg-neutral-700 text-slate-100 text-lg"
            placeholder="What's on your mind"
          />
          {textInptError && (
            <span className="text-red-400 text-sm italic">{textInptError}</span>
          )}
          {selectedGif && (
            <div className="w-full relative">
              <button
                className="absolute top-2 right-0 rounded-full bg-neutral-600 p-1 hover:bg-neutral-500"
                onClick={() => setSelectedGif("")}
              >
                &#10006;
              </button>
              <img
                src={selectedGif}
                alt="selectedGif"
                className="w-full m-1 self-center"
              />
            </div>
          )}
          <div className="relative w-full">
            <button
              className="py-2 border border-slate-200 rounded-lg my-4 bg-neutral-700 text-lg font-bold tracking-wider w-full text-white hover:bg-neutral-600"
              onClick={() => setShowGif((prevState) => !prevState)}
            >
              GIF
            </button>
            {showGif && (
              <div className="flex flex-col items-center absolute -top-72 -right-16 w-[500px] bg-neutral-700 rounded-md p-2 border border-neutral-500 ">
                <button
                  className="self-start text-white rounded-full bg-neutral-600 py-0 px-3 mb-2 text-2xl mb-1 hover:bg-neutral-500"
                  onClick={() => setShowGif(false)}
                >
                  &#129092;
                </button>
                <input
                  type="text"
                  onChange={optimizedDebounce}
                  className="py-2 pl-2 text-slate-100 text-lg px-1 mb-1 rounded-lg bg-neutral-600 w-[99%]"
                  placeholder="Search GIF accross apps"
                />

                <div className="w-full h-[320px] overflow-y-auto rounded-md flex items-center flex-wrap">
                  {!gifFetchLoading ? (
                    <>
                      {Array.isArray(gifQueryRes) && gifQueryRes.length > 0 ? (
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
                                <img
                                  src={url}
                                  alt="gif"
                                  className="w-full rounded-md"
                                />
                              </div>
                            );
                          }
                        )
                      ) : (
                        <div className="w-full flex items-center justify-center">
                          <p className="text-white text-xl italic">
                            No Gif found, Search for something else
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full flex items-center justify-center">
                      <img
                        src={loader}
                        className="bg-neutral-600"
                        alt="giffetchloading"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handlePostSubmit}
            className="w-full bg-blue-500 hover:bg-blue-400 py-2 rounded-md text-white font-bold mb-2 text-lg"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
};

export { CreatePost };
