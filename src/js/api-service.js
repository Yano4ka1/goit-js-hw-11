import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '30297842-30e01d12e48588937048bb7ce';
const image_type = 'photo';
const orientation = 'horizontal';
const safesearch = 'true';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');


form.addEventListener('submit', onSearchFormClick)
loadMoreBtn.addEventListener('click', onBtnLoadMoreClick)

let isShown = 0;


class ImageApiService {
    constructor() {
    this.queryInput = '';
    this.page = 1;
}

    async fetchImages() {

        const options = {
            params: {KEY, q: this.queryInput, image_type, orientation, safesearch, page: this.page, per_page: 40,}
        }
    
        try {
            const response = await axios.get (BASE_URL, options);
                this.incrementPage();
                return response.data;
            }
            catch (error) {
                console.error(error);
                console.log(error.response.status);
            }
        }

        incrementPage() {
            this.page += 1;
        }
        
        resetPage() {
            this.page = 1;
        }

        get searchQuery() {
            return this.queryInput;
        }

        set searchQuery(newSearchQuery) {
            this.queryInput = newSearchQuery;
        }    

    }


const Pixabay = new ImageApiService();

function onSearchFormClick(event) {
    event.preventDefault();
    isShown = 0;
    gallery.innerHTML = '';

    // Pixabay.searchQuery = event.currentTarget.elements.queryInput.value.trim();
    Pixabay.resetPage();

    if (!Pixabay.searchQuery) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }

    fetchImage();
    }


function onBtnLoadMoreClick() {
    Pixabay.incrementPage();
    fetchImage()
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
        refs.loadMoreBtn.classList.remove('is-hidden');
    }

    if (isShown >= totalHits) {
        Notify.info("We're sorry, but you've reached the end of search results.");
    }
}

function renderGallery(hits) {
    const galeryCard = hits
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <div class="photo-card">
            <a class="photo-card__thumb" href={{largeImageURL}}>
                <img class="photo-card__img' 
                    src="{{webformatURL}}" 
                    alt="{{tags }}" 
                    loading="lazy"
                />
            </a>
            <div class="info">
                <p class="info-item">
                    <b>Likes:<br>{{likes}}</b>
                </p>
                <p class="info-item">
                    <b>Views:<br>{{views}}</b>
                </p>
                <p class="info-item">
                    <b>Comments:<br>{{comments}}</b>
                </p>
                <p class="info-item">
                    <b>Downloads:<br>{{downloads}}</b>
                </p>
            </div>
        </div>`;
       }
    )
    .join('');
        gallery.insertAdjacentHTML('beforeend', galeryCard);

        simpleLightBox.refresh();
}

const simpleLightBox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });