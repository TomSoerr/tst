import Helper from './helper';

export default function img({ src, alt }) {
  return Helper.create('img', { src, alt });
}
