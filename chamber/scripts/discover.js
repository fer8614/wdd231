import { places } from '../data/places.mjs';
import { visitMessage } from './discover-visit.mjs';

const visit = document.querySelector('#visit-message');
const now = Date.now();
let previous = null;
try {
  previous = localStorage.getItem('chamber-discover-last-visit');
} catch { /* Browsing without storage still works. */ }
visit.textContent = visitMessage(previous, now);
try {
  localStorage.setItem('chamber-discover-last-visit', String(now));
} catch { /* Storage is optional, not a requirement for exploring. */ }

const dialog = document.querySelector('#place-dialog');
let opener;
dialog.addEventListener('close', () => opener?.focus());

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
}

const gallery = document.querySelector('#places');
places.forEach((place, index) => {
  const card = element('article', null, 'place-card');
  const heading = element('h2', place.name);
  heading.id = place.id;
  card.setAttribute('aria-labelledby', heading.id);
  const figure = element('figure');
  const image = element('img');
  image.src = place.image;
  image.alt = place.alt;
  image.width = 300;
  image.height = 200;
  image.loading = index === 0 ? 'eager' : 'lazy';
  if (index === 0) image.fetchPriority = 'high';
  const caption = element('figcaption');
  const source = element('a', place.photoCredit);
  source.href = place.photoSourceUrl;
  const license = element('a', place.photoLicense);
  license.href = place.photoLicenseUrl;
  caption.append(source, ' · ', license, element('span', place.photoChanges));
  figure.append(image, caption);
  const address = element('address', place.address);
  const description = element('p', place.description, 'place-description');
  const button = element('button', 'Learn More');
  button.type = 'button';
  button.setAttribute('aria-label', `Learn More about ${place.name}`);
  button.addEventListener('click', () => {
    opener = button;
    document.querySelector('#dialog-title').textContent = `Plan your visit: ${place.name}`;
    document.querySelector('#dialog-address').textContent = place.address;
    document.querySelector('#dialog-description').textContent = place.description;
    const link = document.querySelector('#dialog-link');
    link.href = place.learnMoreUrl;
    link.textContent = `Visit ${place.name} website / visitor source`;
    dialog.showModal();
  });
  card.append(heading, figure, address, description, button);
  gallery.append(card);
});
