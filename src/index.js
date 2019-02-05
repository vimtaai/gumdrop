import { handleHashChange } from "./client/navigate";
import { handleLinkClick } from "./client/link";

window.addEventListener("load", handleHashChange);
window.addEventListener("hashchange", handleHashChange);
window.addEventListener("click", handleLinkClick);
