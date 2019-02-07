import { handleHashChange, handleLinkClick } from "./client/navigation";

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("click", handleLinkClick);

handleHashChange();
