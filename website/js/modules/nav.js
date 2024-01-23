import Helper from './helper.js';
import navLink from './nav-link.js';

const navigation = (function navigationIIFE() {
  let navHtmlEl = null;
  let navImgEl = null;
  let navSubMenuEl = null;
  let navImgTimeout = 1;
  let navBreakpoint = null;
  let scrollTop = null;
  let navIconFontSize = null;
  let htmlSpaceX = null;
  let navGapX = null;
  const scrollHistory = [];

  /* ______________________________________
  Shrinking Navigation when scrolled
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */

  function scrolled() {
    return (
      document.body.scrollTop > scrollTop ||
      document.documentElement.scrollTop > scrollTop
    );
  }

  function shrinkNav() {
    if (scrolled()) {
      document.documentElement.dataset.scrolled = true;
    } else {
      document.documentElement.dataset.scrolled = false;
    }
  }

  function removePreloadClass() {
    if (scrolled()) {
      navHtmlEl.classList.remove('tst-preload');
      Helper.removeScrollFn(removePreloadClass);
    }
  }

  // add function that is called when the window is scrolled

  /* ______________________________________
  Hide nav when scrolled down on Mobile
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */

  function hideNavOnScroll() {
    if (scrollHistory.length < 2) {
      scrollHistory.push(document.documentElement.scrollTop);
    } else {
      scrollHistory.shift();
      scrollHistory.push(document.documentElement.scrollTop);
    }

    if (window.innerWidth <= 425 && scrolled()) {
      if (scrollHistory[0] < scrollHistory[1]) {
        navHtmlEl.classList.add('tst-nav-hide');
      } else {
        navHtmlEl.classList.remove('tst-nav-hide');
      }
    }
  }

  // add function that is called when the window is scrolled
  Helper.addScrollFn(hideNavOnScroll);

  /* ______________________________________
  Mobile Navigation
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */

  function checkNavBreakpoint() {
    if (window.innerWidth <= navBreakpoint) {
      navHtmlEl.classList.add('tst-nav-mobile');
    } else if (window.innerWidth <= 425) {
      navHtmlEl.classList.add('tst-nav-mobile');
    } else {
      navHtmlEl.classList.remove('tst-nav-mobile', 'tst-nav-open');
    }
  }

  // why: the width of the nav can only be calculated when the image is loaded
  function navImgLoaded() {
    return new Promise((resolve, reject) => {
      (function interval() {
        if (navImgEl.getClientRects()[0].width > 0) {
          resolve();
        } else {
          navImgTimeout += navImgTimeout;
          setTimeout(interval, navImgTimeout);
        }
      })();
    });
  }

  function calculateNavBreakpoint() {
    let navWidth = 0;

    navWidth += navSubMenuEl * navIconFontSize;
    navWidth += htmlSpaceX * 2;
    navWidth += navImgEl.getClientRects()[0].width;

    navHtmlEl.querySelectorAll('.tst-nav-top-level > li').forEach((li) => {
      navWidth += navGapX;
      navWidth += li.getClientRects()[0].width;
    });

    navBreakpoint = Math.ceil(navWidth);
  }

  // why: sets the important vars and waits for the image to load
  async function initNav() {
    // if html elements are not queried, do the following
    if (!navHtmlEl) {
      navHtmlEl = document.querySelector('#tst-site-nav');
      navImgEl = navHtmlEl.querySelector('img#tst-site-logo');
      navSubMenuEl = navHtmlEl.querySelectorAll('.tst-nav-sub-level').length;
      navIconFontSize =
        parseFloat(
          getComputedStyle(document.body).getPropertyValue(
            '--tst-nav-icon-font-size',
          ),
        ) * 10;
      navGapX =
        parseFloat(
          getComputedStyle(document.body).getPropertyValue('--tst-nav-gap-x'),
        ) * 10;
      htmlSpaceX =
        parseFloat(
          getComputedStyle(document.body).getPropertyValue('--tst-space-x'),
        ) * 10;
    }
    // wait till the image is loaded so the correct nav width can be calculated
    await navImgLoaded();

    // calculate the min width of the nav for the Breakpoint
    calculateNavBreakpoint();

    // check if the nav should collapse after the image is loaded
    checkNavBreakpoint();

    // set the scroll top for the shrink nav function
    scrollTop = document.querySelector(
      'main > header:first-child',
    ).clientHeight;

    Helper.addScrollFn(shrinkNav);
    Helper.addScrollFn(removePreloadClass);
  }

  // add function that is called when the js created content is added to the dom
  // why: to check if the nav links are to wide for the screen
  // this can only be done with js
  Helper.addInitFn(initNav);

  // add function that is called when the window is resized
  // why: to check if the nav links are to wide for the screen
  Helper.addResizeFn(checkNavBreakpoint);

  /* ______________________________________
  HTML Elements
  ¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯¯ */
  function nav() {
    return Helper.create(
      'nav',
      { id: 'tst-site-nav', class: 'tst-section tst-preload' },
      [
        Helper.create('div', { class: 'tst-section-inner' }, [
          Helper.create('img', { src: './img/logo.svg', id: 'tst-site-logo' }),
          Helper.create('ul', { class: 'tst-nav-top-level' }, [
            ...Helper.navItems.navigation.reduce((acc, item) => {
              if (item.unterpunkte) {
                acc.push(
                  navLink(
                    { href: item.href, text: item.text },
                    Helper.create('ul', null, [
                      ...item.unterpunkte.reduce((accInner, itemInner) => {
                        accInner.push(
                          navLink(
                            {
                              href: itemInner.href,
                              text: itemInner.text,
                            },
                            null,
                            true,
                          ),
                        );
                        return accInner;
                      }, []),
                    ]),
                  ),
                );
                return acc;
              }
              acc.push(navLink({ href: item.href, text: item.text }));
              return acc;
            }, []),
          ]),
          Helper.create(
            'button',
            {
              id: 'tst-menu-btn',
            },
            null,
            [
              {
                type: 'click',
                listener: () => {
                  if (navHtmlEl.classList.contains('tst-nav-open')) {
                    navHtmlEl.classList.add('tst-nav-close');
                    setTimeout(() => {
                      navHtmlEl.classList.remove(
                        'tst-nav-open',
                        'tst-nav-close',
                      );
                    }, 100);
                    document.body.style.overflow = 'auto';
                  } else {
                    navHtmlEl.classList.add('tst-nav-open');
                    console.log('open');
                    document.body.style.overflow = 'hidden';
                  }
                },
              },
            ],
          ),
          Helper.create('div', { class: 'tst-nav-overlay' }, null, [
            {
              type: 'click',
              listener: () => {
                navHtmlEl.classList.add('tst-nav-close');
                setTimeout(() => {
                  navHtmlEl.classList.remove('tst-nav-open', 'tst-nav-close');
                  document.body.style.overflow = 'auto';
                }, 100);
              },
            },
          ]),
        ]),
      ],
    );
  }
  return {
    nav,
  };
})();

export default navigation.nav;
