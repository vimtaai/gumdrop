import loadDependencies from './network/load-dependencies';
import load from './client/load';

loadDependencies();

window.addEventListener('load', load);
window.addEventListener('hashchange', load);