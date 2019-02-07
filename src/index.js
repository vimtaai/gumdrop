import { handleHashChange } from "./client/navigation";
import { handleLinkClick } from "./client/link-click";

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("click", handleLinkClick);

handleHashChange();
