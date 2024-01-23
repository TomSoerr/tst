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
let fileName = window.location.pathname.match(fileNameRegEx)[0];
if (fileName === '') {
  fileName = 'index';
}

const siteModule = await import(`./js/pages/${fileName}.js`);

siteModule.load();

// ----------------------------------------
// ----------------------------------------
// ----------------------------------------
// Tests for helper path functions

// ----------------------------------------
// test Helper.relativPath

// /website/index.html to /website/produkte.html
// /website/index to /website/produkte.html
// /index to /website/produkte.html

console.log(Helper.relativPath('/website/index.html', 'seife.html'));
console.log(Helper.relativPath('/website/index.html', 'thomas.html'));
console.log(Helper.relativPath('/website/produkte/seife.html', 'seife2.html'));
console.log(Helper.relativPath('/website/team/thomas.html', 'seife.html'));
console.log(Helper.relativPath('/website/produkte/seife.html', 'index.html'));
console.log(Helper.relativPath('/', 'seife.html'));
console.log(Helper.relativPath('/index', 'seife.html'));
console.log(Helper.relativPath('/index.html', 'seife.html'));
console.log(Helper.absolutePath('/index.html'));
