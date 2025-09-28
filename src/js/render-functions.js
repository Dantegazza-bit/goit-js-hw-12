import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('#gallery');
const loadMoreBtn = document.querySelector('#load-more');
const loader = document.querySelector('#page-loader');

export const lightbox = new SimpleLightbox('#gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

/**
 * @param {Array} images
 * @param {boolean} append  // false — перезапис, true — додавання
 */
export function createGallery(images, append = false) {
  const markup = images
    .map(
      img => `
<li class="gallery-item">
  <a class="gallery-link" href="${img.largeImageURL}">
    <img class="gallery-image" src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
  </a>
  <div class="gallery-info">
    <div class="gallery-info-item"><b>Likes</b>${img.likes}</div>
    <div class="gallery-info-item"><b>Views</b>${img.views}</div>
    <div class="gallery-info-item"><b>Comments</b>${img.comments}</div>
    <div class="gallery-info-item"><b>Downloads</b>${img.downloads}</div>
  </div>
</li>`
    )
    .join('');

  if (append) {
    gallery.insertAdjacentHTML('beforeend', markup);
  } else {
    gallery.innerHTML = markup;
  }
  lightbox.refresh();
}

export function clearGallery() {
  gallery.innerHTML = '';
}

export function showLoader() {
  loader.classList.add('active');
}
export function hideLoader() {
  loader.classList.remove('active');
}

export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('hidden');
}
export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('hidden');
}

// (за бажанням) експорт корисних посилань
export const refs = { gallery, loadMoreBtn, loader };
