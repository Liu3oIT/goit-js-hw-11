import NewApiService from './api-search';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';
const refs = {
  searchForm: document.querySelector('#search-form'),
  hitsContainer: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.button-load-more'),
  endMessage: document.querySelector('.end-message'),
};

const newApiService = new NewApiService();

async function onSearch(e) {
  e.preventDefault();
  cleanPage();
  newApiService.query = e.currentTarget.elements.searchQuery.value;
  if (newApiService.query === '') {
    hideEndMessage();
    hideLoadMoreButton();
    return Notiflix.Notify.failure('Please enter a search query.');
  }

  newApiService.resetPage();

  try {
    const response = await newApiService.fetchHits();
    const infoRef = response.hits.map(info => ({
      webformatURL: info.webformatURL,
      largeImageURL: info.largeImageURL,
      tags: info.tags,
      likes: info.likes,
      views: info.views,
      comments: info.comments,
      downloads: info.downloads,
    }));

    displayInfo(infoRef);
    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);

    if (newApiService.page > response.totalHits / newApiService.per_page) {
      hideLoadMoreButton();
      showEndMessage();
    } else {
      showLoadMoreButton();
      hideEndMessage();
    }
  } catch (e) {
    console.warn(e);
  }
}

async function onLoadMore() {
  newApiService.incrementPage();
  try {
    const response = await newApiService.fetchHits();

    const infoRef = response.hits.map(info => ({
      webformatURL: info.webformatURL,
      largeImageURL: info.largeImageURL,
      tags: info.tags,
      likes: info.likes,
      views: info.views,
      comments: info.comments,
      downloads: info.downloads,
    }));

    displayInfo(infoRef);

    if (newApiService.page > response.totalHits / newApiService.per_page) {
      hideLoadMoreButton();
      showEndMessage();
    }
  } catch (e) {
    console.warn(e);
  }
}

function displayInfo(infoRef) {
  if (!infoRef || infoRef.length === 0) {
    Notiflix.Notify.failure('Oops! Something went wrong');
    cleanPage();
    return;
  }

  const galleryAll = infoRef.map(e => {
    return `<div class="photo-card">
  <a href="${e.largeImageURL}"><img src="${e.webformatURL}" alt="${e.tags}" title="" loading="lazy" width="372" height="240"/></a>
  <div class="info">
    <p class="info-item">&#128151
      <b>${e.likes}</b>
    </p>
    <p class="info-item">&#128064
      <b>${e.views}</b>
    </p>
    <p class="info-item">&#9997
      <b>${e.comments}</b>
    </p>
    <p class="info-item">&#128190
      <b>${e.downloads}</b>
    </p>
  </div>
</div>`;
  });

  refs.hitsContainer.insertAdjacentHTML('beforeend', galleryAll.join(''));
  lightbox();
}

function lightbox() {
  new SimpleLightbox('.gallery .photo-card a', {
    captionDelay: 250,
  });
}

function cleanPage() {
  refs.hitsContainer.innerHTML = '';
}

function showLoadMoreButton() {
  refs.loadMoreBtn.classList.remove('hidden');
}

function hideLoadMoreButton() {
  refs.loadMoreBtn.classList.add('hidden');
}

function showEndMessage() {
  refs.endMessage.textContent =
    "We're sorry, but you've reached the end of search results.";
  refs.endMessage.classList.remove('hidden');
}

function hideEndMessage() {
  refs.endMessage.textContent = '';
  refs.endMessage.classList.add('hidden');
}

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
