import { handleHashChange, handleLoad } from "local/navigation";

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleLoad);
