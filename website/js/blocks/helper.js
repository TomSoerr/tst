export default class Helper {
  /* ______________________________________
  Functions that will load if the dom changes
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */
  static initFn = [];

  static addInitFn(fn) {
    Helper.initFn.push(fn);
  }

  // could also be called "init"
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
        newEl.addEventListener(event.type, event.listener);
      });
    }

    return newEl;
  }
}
