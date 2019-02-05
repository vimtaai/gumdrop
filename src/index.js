import { handleHashChange } from "./client/navigate";
import { handleLinkClick } from "./client/link";
import { cdn } from "./network/cdn";

(async function() {
  // await cdn.require("npm/extramark@0.1.0/dist/extramark.min.js");
  await cdn.require("npm/js-yaml@3.12.1/dist/js-yaml.min.js");
  await cdn.require("npm/mustache@3.0.1/mustache.min.js");

  window.addEventListener("hashchange", handleHashChange);
  window.addEventListener("click", handleLinkClick);

  handleHashChange();
})();
