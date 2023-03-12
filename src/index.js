import axios, { isCancel, AxiosError } from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchBtn: document.querySelector('.header_button'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  form: document.querySelector('.search-form'),
  items: [],
};
let searchValue = '';
let page = 1;
const onFormSubmit = e => {
  page = 1;

  e.preventDefault();
  refs.gallery.innerHTML = '';
  refs.items = [];
  refs.loadMoreBtn.classList.add('is-hidden');
  searchValue = e.target.elements[0].value;
  fetchPhotos(searchValue, page);
};
const onLoadMoreBtn = () => {
  page += 1;

  fetchPhotos(searchValue, page);
};
refs.form.addEventListener('submit', onFormSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

async function fetchPhotos(search, page) {
  const response = await axios.get(
    `https://pixabay.com/api/?key=34327121-8f2f868c5eb1d27b3154ab1d3&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`
  );

  refs.loadMoreBtn.classList.remove('is-hidden');
  const photos = await response.data.hits;
  const total = await response.data.totalHits;
  if (total > 0) {
    Notiflix.Notify.info(`Hooray! We found ${total} images.`);
  }
  if (photos.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else if (photos.length < 39 && photos.length > 0) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
    refs.loadMoreBtn.classList.add('is-hidden');
  }

  refs.items = [...refs.items, ...photos];
  renderMarkup();
  // refresh();
}

function renderMarkup() {
  const markup = refs.items
    .map(photo => {
      return `<a href="${photo.largeImageURL}"><div class="photo-card">
  <img src="${photo.largeImageURL}"width="300" height="200" alt="${photo.tags}" loading="lazy" />
  
  <div class="info">
    <p class="info-item">
      <b>Likes: </b> ${photo.likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${photo.views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${photo.comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${photo.downloads}
    </p>
  </div>
</div></a>`;
    })
    .join('');
  refs.gallery.innerHTML = markup;
  const a = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionPosition: 'bottom',
    captionDelay: 250,
    scrollZoom: false,
  });
}
