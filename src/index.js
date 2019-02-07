import { handleHashChange } from "./client/navigate";
import { handleLinkClick } from "./client/link";

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("click", handleLinkClick);

handleHashChange();
