export default class Helper {
  /* ______________________________________
  Site structure
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */
  static navItems = {
    logo: { src: 'img/logo.svg', alt: 'Logo' },
    navigation: [
      { text: 'Startseite', href: 'index.html' },
      {
        text: 'Produkte',
        folder: 'produkte',
        href: '#',
        unterpunkte: [
          { text: 'Seife', href: 'seife.html' },
          { text: 'Seife 2', href: 'seife2.html' },
        ],
      },
      { text: 'Über uns', href: '#' },
      { text: 'Kontakt', href: '#' },
      {
        text: 'Team',
        folder: 'team',
        href: '#',
        unterpunkte: [{ text: 'Thomas Meier', href: 'thomas.html' }],
      },
    ],
  };

  /* ______________________________________
  Functions to get path to produkte.js, pages/*.js, subfolder/*.html, img/*,
  index.html and from subpage to other subpage
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */

  static getAllSubFolders() {
    const folders = [];
    this.navItems.navigation.forEach((item) => {
      if (item.folder) folders.push(item.folder);
    });
    return folders;
  }

  static folderExists(folder) {
    return this.getAllSubFolders().includes(folder);
  }

  static getFolderPath(pathname) {
    const path = pathname;

    if (path === '/' || path === '/index.html' || path === '/index') {
      return null;
    }

    const pathWithoutFileRegEx = /.*\//;
    const lastFolderRegEx = /\w+(?=\/$)/;

    const pathWithoutFile = path.match(pathWithoutFileRegEx);

    if (pathWithoutFile) {
      const lastFolder = pathWithoutFile[0].match(lastFolderRegEx)[0];

      if (this.folderExists(lastFolder)) {
        return lastFolder;
      }
    }
    return null;
  }

  // input should be window.location.pathname
  static pathToMain(pathname) {
    const path = pathname;

    if (this.getFolderPath(path)) {
      return '../';
    }
    return '';
  }

  static getFolderData(fileName) {
    const subNav = this.navItems.navigation.filter((item) => item.folder);
    const folder = subNav.find((item) => {
      // folderObj is undefined if filename is not in the folder
      const folderObj = item.unterpunkte.find(
        (pages) => pages.href === fileName,
      );
      return folderObj;
    });

    if (!folder) return null;
    return folder.folder;
  }

  static checkIfNotSubpage(fileName) {
    const notSubNav = this.navItems.navigation.filter((item) => !item.folder);
    return notSubNav.find((item) => item.href === fileName);
  }

  static relativPath(from, to) {
    const relativePath = this.pathToMain(from);

    if (this.getFolderPath(from) === this.getFolderData(to)) {
      return to;
    }

    if (this.checkIfNotSubpage(to)) {
      return `${relativePath}${to}`;
    }

    return `${this.pathToMain(from)}${this.getFolderData(to)}/${to}`;
  }

  static absolutePath(pathname, origin) {
    const pathWithoutFileRegEx = /.*\//;
    const PathWithoutLastFolder = /.*\/(?=\w*\/)/;

    const pathWithoutFile = pathname.match(pathWithoutFileRegEx);

    if (pathWithoutFile[0] === '/') {
      return `${origin}/`;
    }

    if (this.getFolderPath(pathname)) {
      return `${origin}${pathname.match(PathWithoutLastFolder)}`;
    }

    return `${origin}${pathWithoutFile}`;
  }

  /* ______________________________________
  Functions that will load if the dom changes
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */
  static initFn = [];

  static addInitFn(fn) {
    Helper.initFn.push(fn);
  }

  static init() {
    // called when the js created content is added to the dom
    Promise.resolve().then(() => {
      if (Helper.initFn) Helper.initFn.forEach((fn) => fn());
      // maybe remove all functions after inital load
      Helper.initFn = null;
    });
  }

  /* ______________________________________
  Functions that will load if the window is resized
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */
  static resizeFn = [];

  static resizeTimeout = false;

  static addResizeFn(fn) {
    Helper.resizeFn.push(fn);
  }

  static removeResizeFn(fn) {
    Helper.resizeFn = Helper.resizeFn.filter((f) => f !== fn);
  }

  static resize(event) {
    // add timeout to
    if (!Helper.navTimeout && Helper.resizeFn) {
      Helper.resizeFn.forEach((fn) => fn(event));

      Helper.navTimeout = true;
      setTimeout(() => {
        Helper.navTimeout = false;
      }, 100);
    }
  }

  /* ______________________________________
  Function that will load if user scrolls
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */
  static scrollFn = [];

  static addScrollFn(fn) {
    Helper.scrollFn.push(fn);
  }

  static removeScrollFn(fn) {
    Helper.scrollFn = Helper.scrollFn.filter((f) => f !== fn);
  }

  static scroll(event) {
    if (Helper.scrollFn) Helper.scrollFn.forEach((fn) => fn(event));
  }

  /* ______________________________________
  Function to build HTML Elements
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */
  static elements = {};

  static create(el, elAtt, elChildren, elEvent) {
    if (!Helper.elements[el]) {
      Helper.elements[el] = document.createElement(el);
    }

    const newEl = Helper.elements[el].cloneNode(true);

    if (elAtt) {
      Object.entries(elAtt).forEach(([key, value]) => {
        if (key === 'class') {
          value.split(' ').forEach((className) => {
            newEl.classList.add(className);
          });
        }
        if (key === 'text') {
          newEl.textContent = value;
        }
        if (key !== 'class' && key !== 'text') {
          newEl.setAttribute(key, value);
        }
      });
    }
    if (elChildren) {
      newEl.append(...elChildren);
    }

    if (elEvent) {
      elEvent.forEach((event) => {
        if (event) newEl.addEventListener(event.type, event.listener);
      });
    }

    return newEl;
  }
}
