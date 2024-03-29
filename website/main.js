import Helper from './js/modules/helper.js';

console.clear();

/* ______________________________________
initialize Helper class
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */
const observer = new MutationObserver(Helper.init);

observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true,
});

window.addEventListener('resize', Helper.resize);
window.addEventListener('scroll', Helper.scroll);

/* ______________________________________
load js file for html site
¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */

const fileNameRegEx = /\w+(?=\.html)/;
let fileName = window.location.pathname.match(fileNameRegEx);

if (fileName === null) {
  fileName = 'index';
} else {
  fileName = fileName[0];
}

const siteModule = await import(`./js/pages/${fileName}.js`);

siteModule.load();
