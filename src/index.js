import loadFromCDN from './network/load-from-cdn';
import load from './client/load';

loadFromCDN('npm/markdown-it@8/dist/markdown-it.min.js'),
loadFromCDN('npm/markdown-it-deflist@2/dist/markdown-it-deflist.min.js'),
loadFromCDN('npm/markdown-it-container@2/dist/markdown-it-container.min.js'),
loadFromCDN('gh/highlightjs/cdn-release@9/build/highlight.min.js')

window.addEventListener('load', load);
window.addEventListener('hashchange', load);