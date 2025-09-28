// main.js
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const input = form.elements['search-text'];
const loadMoreBtn = document.querySelector('#load-more');

let query = '';
let page = 1;
let totalPages = 1;

hideLoadMoreButton(); // кнопка прихована на старті

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  query = input.value.trim();
  if (!query) return;

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);
    if (!Array.isArray(hits) || hits.length === 0) {
      iziToast.warning({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    totalPages = Math.max(1, Math.ceil(totalHits / PER_PAGE));

    createGallery(hits, false); // перший рендер (без append)

    if (page < totalPages) showLoadMoreButton();
  } catch (err) {
    iziToast.error({
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  if (page >= totalPages) return;

  loadMoreBtn.disabled = true;
  showLoader();

  try {
    page += 1;
    const { hits } = await getImagesByQuery(query, page);
    createGallery(hits, true); // додаємо (append)

    smoothScrollByCardHeight();

    if (page >= totalPages) {
      hideLoadMoreButton();
      iziToast.show({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (err) {
    hideLoadMoreButton();
    iziToast.error({
      message: 'Could not load more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    loadMoreBtn.disabled = false;
  }
}

function smoothScrollByCardHeight() {
  const firstCard = document.querySelector('.gallery .gallery-item');
  if (!firstCard) return;
  const { height } = firstCard.getBoundingClientRect();
  window.scrollBy({ top: height * 2, behavior: 'smooth' });
}
