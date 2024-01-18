import Helper from './js/blocks/helper.js';
console.clear();

// initialize Helper class
const observer = new MutationObserver(Helper.init);

observer.observe(document.body, {
  attributes: false,
  childList: true,
  subtree: true,
});

window.addEventListener('resize', Helper.resize);

// load js file for html site
const fileNameRegEx = /\w+(?=\.html)/;
const fileName = window.location.pathname.match(fileNameRegEx)[0];

const siteModule = await import(`./js/pages/${fileName}.js`);

siteModule.load();
