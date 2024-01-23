import nav from '../modules/nav.js';

const fileRegEx = /.*(?=\/\w+\.html)/;
const fileName = 'produkte';
const currentPath = `${window.location.origin}${window.location.pathname}`;

const path = `${currentPath.match(fileRegEx)[0]}/data/${fileName}.json`;
console.log(path);

const dataJson = await fetch(path, {
  method: 'GET',
  credentials: 'include',
  mode: 'cors',
});
const data = await dataJson.json();

function load() {
  document.body.append(nav());
  document.body.append(data.hero);
}

export { load };
