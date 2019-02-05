import { fetchResource } from "../network/fetch";

const root = document.querySelector("main");
const loader = root.innerHTML;
const timeoutUntilLoader = 500;

export async function navigate() {
  const [file, fragment] = window.location.hash.replace(/^#!?\/?/, "").split("#");

  const loaderTimer = window.setTimeout(function() {
    root.innerHTML = loader;
  }, timeoutUntilLoader);

  const page = file || "index";
  const content = await fetchResource("pages", page, "md");

  root.innerHTML = content;
  window.clearTimeout(loaderTimer);

  if (fragment === undefined) {
    window.scrollTo({ top: 0, behavior: "auto" });
  } else {
    const elem = document.getElementById(fragment);

    if (elem !== null) {
      elem.scrollIntoView({ block: "start", behavior: "smooth" });
    }
  }
}
