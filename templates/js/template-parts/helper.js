export default class Helper {
  static elements = {};

  static create(el, elAtt, elChildren, elEvent) {
    if (!this.elements[el]) {
      this.elements[el] = document.createElement(el);
    }

    const newEl = this.elements[el].cloneNode(true);

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
