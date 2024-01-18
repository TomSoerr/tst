import Helper from './helper.js';

const navigation = (function navigationIIFE() {
  // TODO: data for the nav should be loaded from json
  // TODO: test what happens when json is wrong or not loaded
  const navItems = [
    { text: 'Produkte', href: '#' },
    { text: 'Geschichte', href: '#' },
    { text: 'Karriere', href: '#' },
    { text: 'Kontakt', href: '#' },
    { text: 'Log in', href: '#' },
  ];

  let navHtmlEl = null;
  let navImgEl = null;
  let navLiEl = null;
  let navBreakpoint = null;
  let navImgTimeout = null;
  let navDesktop = true;

  // why: the width of the nav can only be calculated when the image is loaded
  function navImgLoaded() {
    return new Promise((resolve, reject) => {
      const intervalId = setInterval(() => {
        if (navImgEl.getClientRects()[0].width > 0) {
          clearInterval(intervalId);
          resolve();
        } else if (navImgTimeout > 10000) {
          reject(new Error('Image was not loaded'));
        } else {
          navImgTimeout = !navImgTimeout ? 1 : navImgTimeout + navImgTimeout;
        }
      });
    }, navImgTimeout);
  }

  // why: without this function the nav could only collapse but not open again
  function checkForDesktopLayout() {
    if (navHtmlEl.clientWidth > navBreakpoint) {
      navHtmlEl.classList.remove('tst-nav-mobile');
      navHtmlEl.classList.remove('tst-nav-open');

      Helper.removeResizeFn(checkForDesktopLayout);
      navDesktop = true;
    }
  }

  function updateNav() {
    const changeNavToMobile = () => {
      // add listener for a future resize (so the nav can open again)
      Helper.addResizeFn(checkForDesktopLayout);

      // add class to collapse the nav
      navHtmlEl.classList.add('tst-nav-mobile');

      // set navDesktop to false so this function is not called again
      navDesktop = false;
    };

    // if: text links are to many -> nav should collapse
    if (!navBreakpoint) {
      if (
        navDesktop &&
        navHtmlEl.clientHeight / 2 < navLiEl.getClientRects()[0].top
      ) {
        // save breakpoint for later resize
        navBreakpoint = navHtmlEl.clientWidth;

        changeNavToMobile();
      }
    } else if (navDesktop && navHtmlEl.clientWidth <= navBreakpoint) {
      changeNavToMobile();
    } else {
      // debugger;
      throw new Error('Something went wrong with the nav');
    }
  }

  // why: sets the important vars and waits for the image to load
  async function initNav() {
    // if html elements are not queried, do the following
    if (!navHtmlEl) {
      navHtmlEl = document.querySelector('#tst-site-nav');
      navImgEl = navHtmlEl.querySelector('img#tst-site-logo');
      navLiEl = navHtmlEl.querySelector('ul li:last-child');
    }
    // wait till the image is loaded so the correct nav width can be calculated
    await navImgLoaded();

    // check if the nav should collapse after the image is loaded
    updateNav();
  }

  // add function that is called when the js created content is added to the dom
  // why: to check if the nav links are to wide for the screen
  // this can only be done with js
  Helper.addInitFn(initNav);

  // why: if the user resizes the window or flips the device
  // the nav should be checked again
  Helper.addResizeFn(updateNav);

  // built the html elements
  function nav() {
    return Helper.create('nav', { id: 'tst-site-nav', class: 'tst-section' }, [
      Helper.create('div', { class: 'tst-section-inner' }, [
        Helper.create('img', { src: './img/logo.svg', id: 'tst-site-logo' }),
        Helper.create('ul', null, [
          ...navItems.reduce((acc, item) => {
            acc.push(
              Helper.create('li', null, [
                Helper.create('a', { href: item.href, text: item.text }),
              ]),
            );
            return acc;
          }, []),
        ]),
        Helper.create(
          'button',
          {
            class: 'material-symbols-rounded',
            id: 'tst-menu-btn',
            text: 'menu',
          },
          null,
          [
            {
              type: 'click',
              listener: () => {
                navHtmlEl.classList.toggle('tst-nav-open');
              },
            },
          ],
        ),
      ]),
    ]);
  }
  return {
    nav,
  };
})();

export default navigation.nav;
