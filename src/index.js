import { handleHashChange, handleLoad } from "./client/navigation";

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleLoad);
