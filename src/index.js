import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onCountries, DEBOUNCE_DELAY));

function onCountries(e) {
    e.preventDefault();
    const name = e.target.value.trim();
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';

    if (!name) {
        return;}

    fetchCountries(name).then(countries => {
        console.log(countries);
        if (countries.length > 10) {
            return Notify.info("Too many matches found. Please enter a more specific name.");
        }
        renderCountryList(countries);
    }).catch(err => Notify.failure("Oops, there is no country with that name"));
}

function renderCountryList(countries) {
    if (countries.length === 1) {
        renderCountryInfo(countries);
    } else {
        const markup = countries
            .map(({flags, name}) => {
                return `
                <li class="country-list__item">
                    <img class="country-list__img" 
                    src="${flags.svg}" 
                    alt="Flag of ${name.official}" 
                    width = 40px 
                    height = 30px>
                    <p class="country-list__name">${name.official}</p>
                </li>
                `;
            }).join("");
    countryInfo.innerHTML = markup;
    }
}

function renderCountryInfo(countries) {
    const markup = countries
    .map(({ flags, name, capital, population, languages }) => {
      return `<img width="100px" 
      height="100px" 
      src='${flags.svg}' 
      alt='${name.official} flag' />
        <ul class="country-info__list">
            <li class="country-info__item country-info__item--name"><p><b>Name: </b>${name.official}</p></li>
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages)}</p></li>
        </ul>`;
    })
    .join('');
    countryInfo.innerHTML = markup;
  }