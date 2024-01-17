import Helper from './helper.js';

const navItems = [
  { text: 'Produkte', href: '#' },
  { text: 'Geschichte', href: '#' },
  { text: 'Karriere', href: '#' },
  { text: 'Kontakt', href: '#' },
  { text: 'Log in', href: '#' },
];

// function updateNav() {
//   alert('important');

//
// }

Helper.addLoadedFn(() => {
  const navOuter = document.querySelector('#tst-site-nav');
  const navInner = navOuter.querySelector('.tst-section-inner');
  console.log(navOuter, navInner);
});

export default function nav() {
  return Helper.create('nav', { id: 'tst-site-nav', class: 'tst-section' }, [
    Helper.create('div', { class: 'tst-section-inner' }, [
      Helper.create('img', { src: './img/logo.svg' }),
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
              const nav = document.querySelector('#tst-site-nav');
              nav.classList.toggle('tst-section-open');
            },
          },
        ],
      ),
    ]),
  ]);
}
