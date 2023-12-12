import { handleHashChange, handleLoad } from "./local/navigation.js";

window.addEventListener("hashchange", handleHashChange);
window.addEventListener("load", handleLoad);
