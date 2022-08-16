import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.5.min.css';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;

const inputEl = document.querySelector('#search-box');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch() {
  const nameForSearch = inputEl.value.trim();
  if (nameForSearch === '') {
    countryListEl.innerHTML = '';
    countryInfoEl.innerHTML = '';
    return;
  }
  fetchCountries(nameForSearch)
    .then(data => {
      if (data.status === 404) {
        Notify.warning('Ooops, there is no country with that name');
      }
      if (data.length > 10) {
        Notify.warning(
          'Too many matches found. Please enter a more specific name.'
        );
        return;
      }
      if (data.length >= 2 && data.length <= 10) {
        countryInfoEl.innerHTML = '';
        countryListEl.innerHTML = data
          .map(
            element =>
              `<li><img src="${element.flags.svg}" alt="flag" width="28"> <span>${element.name.official}</span></li>`
          )
          .join('');
      }
      if (data.length === 1) {
        countryListEl.innerHTML = '';
        countryInfoEl.innerHTML = `<div><img src="${
          data[0].flags.svg
        }" alt="flag" width="35"> <h1>${data[0].name.official}</h1></div>
        <div><h2>Capital:</h2> <span>${data[0].capital}</span></div>
        <div><h2>Population:</h2> <span>${data[0].population}</span></div>
        <div><h2>Languages:</h2> <span>${Object.keys(data[0].languages)
          .map(language => data[0].languages[language])
          .join(', ')}</span></div>`;
      }
    })
    .catch(error => {
      Notify.failure('Error');
      console.log(error);
    });
}
