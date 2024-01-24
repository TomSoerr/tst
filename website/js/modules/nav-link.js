import Helper from './helper.js';

function removeAfterLoad(element, singleUseEventFn) {
  element.classList.remove('tst-preload');
  element.removeEventListener('mouseover', singleUseEventFn);
  element.removeEventListener('focusin', singleUseEventFn);
}

function getLiElement(target) {
  if (target.tagName === 'A') {
    return target.parentElement;
  }
  if (target.tagName === 'LI') {
    return target;
  }
  console.error('Invalid target');
}

function singleUseEvent(event) {
  removeAfterLoad(getLiElement(event.target), singleUseEvent);
  event.stopPropagation();
}

function customHoverIn(event) {
  getLiElement(event.target).classList.add('tst-hover');
}

function customHoverOut(event) {
  setTimeout(() => {
    getLiElement(event.target).classList.remove('tst-hover');
  }, 300);
}

function clickToOpen(event) {
  const liElement = getLiElement(event.target);
  if (liElement.classList.contains('tst-nav-sub-level')) {
    getLiElement(event.target).classList.toggle('tst-open');
    event.preventDefault();
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
    ...defaultEvent,
    type: 'click',
    listener: clickToOpen,
  },
];

const subMenuItemEvent = [
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

export default function navLink({ href, text }, subMenu, isSubMenuItem) {
  const relHref = Helper.relativPath(window.location.pathname, href);
  return Helper.create(
    'li',
    { class: !subMenu ? 'tst-preload' : 'tst-preload tst-nav-sub-level' },
    !subMenu
      ? [Helper.create('a', { href: relHref, text })]
      : [Helper.create('a', { href: relHref, text }), subMenu],
    isSubMenuItem ? subMenuItemEvent : subMenu ? subMenuEvent : defaultEvent,
  );
}
