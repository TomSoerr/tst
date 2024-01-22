const link = document.createElement('link');

function addPreload(filename) {
  // clone the link element
  const preloadLink = link.cloneNode(true);
  preloadLink.href = filename;
  preloadLink.rel = 'modulepreload';
  document.head.appendChild(preloadLink);
}

const fileNameRegEx = /\w+(?=\.html)/;
const fileName = window.location.pathname.match(fileNameRegEx)[0];

addPreload(`./js/pages/${fileName}.js`);
