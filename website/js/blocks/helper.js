export default class Helper {
  // Functions that will load if the dom changes
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

  // Functions that will load if the window is resized
  static resizeFn = [];

  static addResizeFn(fn) {
    Helper.resizeFn.push(fn);
  }

  static removeResizeFn(fn) {
    Helper.resizeFn = Helper.resizeFn.filter((f) => f !== fn);
  }

  static resize(event) {
    if (Helper.resizeFn) Helper.resizeFn.forEach((fn) => fn(event));
  }

  // Function to build HTML Elements
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
