import './navigation.mjs';
import { displayConfirmation } from './details.mjs';
const supplied = displayConfirmation(document.querySelector('#confirmation-fields'), location.search);
document.querySelector('#confirmation-status').textContent = supplied
  ? 'Here are the entries supplied in this URL. They have not been verified or delivered.'
  : 'No form entries were supplied. You can try the educational form on a game details page.';
