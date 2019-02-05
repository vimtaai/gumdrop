import { fetchResource } from "../network/fetch";
import { currentLocation } from "./location";

const root = document.querySelector("main");
const loader = root.innerHTML;
const timeoutUntilLoader = 500;

let previousLocation = {};

export async function handlePageNavigation() {
  const { page } = currentLocation();

  if (page === previousLocation.page) {
    return;
  }

  const loaderTimer = window.setTimeout(function() {
    root.innerHTML = loader;
  }, timeoutUntilLoader);

  const file = page || "index";
  const content = await fetchResource("pages", file, "md");

  root.innerHTML = content;
  window.clearTimeout(loaderTimer);

  previousLocation.page = page;
}

export function handleFragmentNavigation() {
  const { fragment } = currentLocation();

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
