import { loadPage } from './load';
import { transformLoops } from './loops';

window.addEventListener('load', transformLoops);
window.addEventListener('load', loadPage);
window.addEventListener('hashchange', loadPage);