import { updateLocation } from "./location";

import { updatePage } from "./navigation/page";
import { scrollToFragment } from "./navigation/fragment";
import { updateHash } from "./navigation/hash";

export async function handleHashChange() {
  updateLocation();
  await updatePage();
  scrollToFragment();
}

export function handleLinkClick(event) {
  const target = event.target.closest("a");

  if (target === null) {
    return;
  }

  const href = target.getAttribute("href");

  if (href.charAt(0) !== "#" || href.charAt(1) === "!") {
    return;
  }

  event.preventDefault();
  updateHash(href);
}
