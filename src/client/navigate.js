import { fetchContent } from "../network/fetch";
import { getCurrentLocation } from "./location";

const rootNode = document.querySelector("main") || document.body;
const loaderElement = rootNode.innerHTML;

let previousLocation = {};

export async function handlePageNavigation() {
  const timeoutUntilLoader = 500;
  const { page } = getCurrentLocation();

  if (page === previousLocation.page) {
    return;
  }

  const loaderTimer = window.setTimeout(function() {
    rootNode.innerHTML = loaderElement;
  }, timeoutUntilLoader);

  const file = page || "index";
  const content = await fetchContent("pages", file, "md");

  rootNode.innerHTML = content;
  window.clearTimeout(loaderTimer);

  previousLocation.page = page;
}

export function handleFragmentNavigation() {
  const { fragment } = getCurrentLocation();

  if (fragment === undefined) {
    window.scrollTo({ top: 0, behavior: "auto" });
  } else {
    const elem = document.getElementById(fragment);

    if (elem !== null) {
      elem.scrollIntoView({ block: "start" });
    }
  }

  previousLocation.fragment = fragment;
}

export async function handleHashChange() {
  await handlePageNavigation();
  await handleFragmentNavigation();
}
