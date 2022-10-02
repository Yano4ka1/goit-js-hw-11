import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', onSearchFormClick)
loadMoreBtn.addEventListener('click', onBtnLoadMoreClick)

const BASE_URL = 'https://pixabay.com/api/';
const key = '30297842-30e01d12e48588937048bb7ce';
const image_type = 'photo';
const orientation = 'horizontal';
const safesearch = 'true';

let isShown = 0;

class NewPixabay {
    constructor () {
        this.searchQuery = '';
        this.page = 1;
    }

    async fetchImage() {
        const options = {
            params: {
                key,
                q: this.searchQuery,
                image_type,
                orientation,
                safesearch,
                page: this.page,
                per_page: 40,
            }
        }
    
        try {
            const response = await axios.get(BASE_URL, options);
                this.incrementePage();
                return response.data;
            }
            catch (error) {
                console.error(error);
                console.log(error.response.data);
            }
        }

        incrementePage() {
            this.page += 1;
        }
        
        resetPage() {
            this.page = 1;
        }

        get query() {
            return this.searchQuery;
        }

        set query(newSearchQuery) {
            this.searchQuery = newSearchQuery;
        }    
    }

const Pixabay = new NewPixabay();

function onSearchFormClick(event) {
    event.preventDefault();
    isShown = 0;

    gallery.innerHTML = '';

    Pixabay.query = event.currentTarget.elements.searchQuery.value.trim();
    Pixabay.resetPage();

    if (!Pixabay.query) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }

    fetchImage();
    }


function onBtnLoadMoreClick() {
    Pixabay.incrementePage();
    fetchImage();
    }

async function fetchImage() {
    loadMoreBtn.classList.add('is-hidden')

    const { hits, total, totalHits } = await Pixabay.fetchImage();    
    if (!hits.length) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }

    renderGallery(hits);

    isShown += hits.length;

    if (isShown < totalHits) {
        loadMoreBtn.classList.remove('is-hidden');
    }

    if (isShown >= totalHits) {
        Notify.info("We're sorry, but you've reached the end of search results.");
    }
}

function renderGallery(hits) {
    const galeryCard = hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <a class="photo-card__thumb" href=${largeImageURL}>
        <div class="photo-card">
                    <img class="photo-card__img' 
                    src="${webformatURL}" 
                    alt="${tags}" 
                    loading="lazy"
                />
          
            <div class="info">
                <p class="info-item">
                    <b>Likes:<br>${likes}</b>
                </p>
                <p class="info-item">
                    <b>Views:<br>${views}</b>
                </p>
                <p class="info-item">
                    <b>Comments:<br>${comments}</b>
                </p>
                <p class="info-item">
                    <b>Downloads:<br>${downloads}</b>
                </p>
            </div>
        </div>
        </a>`
       }
    )
    .join('');
        gallery.insertAdjacentHTML('beforeend', galeryCard);

        simpleLightBox.refresh();
}

const simpleLightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    // captionDelay: 250,
  });