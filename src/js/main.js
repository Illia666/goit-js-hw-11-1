import { Notify } from 'notiflix/build/notiflix-notify-aio';

import getPictures from './getImages';
import SettingImageHeight from './drawImages';
import { checkPosition } from './utils/infinityScroll';
import { addFormatString } from './utils/textFormat';
import { messages } from './messages';
import debounce from 'lodash.debounce';

//
const PER_PAGE = 20;
const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
  loader: document.querySelector('.loader-wrapper'),
};

const setImages = new SettingImageHeight(refs.gallery);
let page = 1;
let loadedImages = 0;
let totalImages = 0;
let searchString = '';
const onEndOfCollection = () => {
  if (totalImages === loadedImages && totalImages != 0) {
    Notify.info(messages.endOfCollection);
    return true;
  }
  return false;
};

const getImages = async value => {
  if (!onEndOfCollection())
    try {
      const getData = await getPictures(value, page, PER_PAGE);
      const images = getData.hits;
      const total = getData.totalHits;

      if (page === 1) {
        Notify.success(messages.success.format(total));
        totalImages = total;
      }
      loadedImages += images.length;
      page += 1;
      setImages.draw(images);
      onEndOfCollection();
    } catch {
      Notify.failure(messages.failure);
    } finally {
      refs.loader.classList.add('hidden');
    }
  // refs.btnLoadMore.parentNode.classList.remove('hidden');
};

const handleOnSubmit = e => {
  e.preventDefault();
  refs.loader.classList.remove('hidden');
  page = 1;
  loadedImages = 0;
  totalImages = 0;
  searchString = e.target.elements.searchQuery.value;
  refs.btnLoadMore.parentNode.classList.add('hidden');
  setImages.reset();

  getImages(searchString);
};

const handleLoadMore = e => {
  getImages(searchString);
};

addFormatString();
window.addEventListener(
  'scroll',
  debounce(e => {
    checkPosition(() => {
      if (!searchString) return;
      getImages(searchString);
    });
  }, 300)
);

refs.btnLoadMore.parentNode.classList.toggle('hidden');
refs.loader.classList.add('hidden');
refs.searchForm.addEventListener('submit', handleOnSubmit);
refs.btnLoadMore.addEventListener('click', handleLoadMore);