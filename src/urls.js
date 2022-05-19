const API__KEY = process.env.REACT_APP_API_KEY;
const GIPHY__API = `https://api.giphy.com/v1/gifs/search?api_key=${API__KEY}`;

console.log(GIPHY__API);

export { GIPHY__API };
