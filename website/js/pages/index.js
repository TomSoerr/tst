import nav from '../modules/nav.js';
import Helper from '../modules/helper.js';

const path = `${Helper.absolutePath(
  window.location.pathname,
  window.location.origin,
)}data/produkte.json`;

const dataJson = await fetch(path, {
  method: 'GET',
  mode: 'cors',
  crossOrigin: 'anonymous',
});
const data = await dataJson.json();

function load() {
  document.body.append(nav());
  document.body.append(data.hero);
}

export { load };
