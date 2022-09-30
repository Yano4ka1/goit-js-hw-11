const URS = 'https://restcountries.com/v3.1/name/';

const ATR = 'fields=name,capital,population,flags,languages';

export function fetchCountries(name) {

  return fetch
    (`${URS}${name}?${ATR}`)
    
  .then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}