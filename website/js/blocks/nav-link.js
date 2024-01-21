import Helper from './helper.js';

function removeAfterLoad(element, singleUseEvent) {
  element.classList.remove('tst-preload');
  element.removeEventListener('mouseover', singleUseEvent);
  element.removeEventListener('focusin', singleUseEvent);
}

function singleUseEvent(event) {
  if (event.target.tagName !== 'LI') {
    removeAfterLoad(event.target.parentElement, singleUseEvent);
  } else {
    removeAfterLoad(event.target, singleUseEvent);
  }
  event.stopPropagation();
}

function customHoverIn(event) {
  if (event.target.tagName !== 'LI') {
    event.target.parentElement.classList.add('tst-hover');
  } else {
    event.target.classList.add('tst-hover');
  }
}

function customHoverOut(event) {
  if (event.target.tagName !== 'LI') {
    setTimeout(() => {
      event.target.parentElement.classList.remove('tst-hover');
    }, 300);
  } else {
    setTimeout(() => {
      event.target.classList.remove('tst-hover');
    }, 300);
  }
}

const defaultEvent = [
  {
    type: 'mouseover',
    listener: singleUseEvent,
  },
  {
    type: 'focusin',
    listener: singleUseEvent,
  },
];

const subMenuEvent = [
  {
    type: 'mouseover',
    listener: customHoverIn,
  },
  {
    type: 'mouseout',
    listener: customHoverOut,
  },
  {
    type: 'focusin',
    listener: customHoverIn,
  },
  {
    type: 'focusout',
    listener: customHoverOut,
  },
];

export default function navLink({ href, text }, subMenu, subMenuItem) {
  return Helper.create(
    'li',
    { class: !subMenu ? 'tst-preload' : 'tst-preload tst-nav-sub-level' },
    !subMenu
      ? [Helper.create('a', { href, text })]
      : [Helper.create('a', { href, text }), subMenu],
    !subMenuItem ? defaultEvent : subMenuEvent,
  );
}
