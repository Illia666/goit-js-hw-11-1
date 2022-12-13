const axios = require('axios').default;

const URL1 = 'https://pixabay.com/api/';
const KEY = '31214136-385c270b0ee6f522fe0942e9a';
const searchParams = new URLSearchParams({
  key: KEY,
  q: 'cat',
  image_type: 'photo',
  orientation: 'horizontal',
  pretty: 'true',
  lang: 'ru',
  safesearch: 'true',
  page: 1,
  per_page: 20,
});

const getPictures = async (text, page = 1, per_page = 20) => {
  const searchText = encodeURIComponent(text);
  searchParams.set('q', text);
  searchParams.set('page', page);
  searchParams.set('per_page', per_page);
  try {
    const response = await axios.get(URL1, {
      params: searchParams,
    });
    const arr = await response.data.hits;
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
  return arr;
};

// getPictures('red cars');
// console.log(axios.get);

export default getPictures;