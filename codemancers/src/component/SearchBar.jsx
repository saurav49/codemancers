import { useState, useEffect, useCallback } from "react";

const SearchBar = () => {
  const [textInpt, setTextInpt] = useState("");
  const [gifSearchText, setGifSearchText] = useState("");
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {}, []);

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

  return (
    <div className="w-[300px] border border-2 border-slate-200 rounded-sm my-0 mx-auto flex flex-col items-start justify-between">
      <textarea
        type="text"
        value={textInpt}
        onChange={(e) => setTextInpt(e.target.value)}
        className="w-full border border-2 border-slate-400 p-1 rounded-sm"
        placeholder="write something here"
      />
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
      </div>
      <p>{gifSearchText}</p>
    </div>
  );
};

export { SearchBar };
