import appendDevLines from './js/dev-lines.js';

appendDevLines();

const fileNameRegEx = /\w+(?=\.html)/;
const fileName = window.location.pathname.match(fileNameRegEx)[0];

const siteModule = await import(`./js/${fileName}.js`);
siteModule.load();
