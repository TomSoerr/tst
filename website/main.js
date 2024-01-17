import Helper from './js/blocks/helper.js';

const observer = new MutationObserver(Helper.loaded);

observer.observe(document.body, {
  attributes: true,
  childList: true,
  subtree: true,
});

const fileNameRegEx = /\w+(?=\.html)/;
const fileName = window.location.pathname.match(fileNameRegEx)[0];

const siteModule = await import(`./js/pages/${fileName}.js`);
siteModule.load();
