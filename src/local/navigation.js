import { Location } from "./location.js";

import { loadContent } from "./navigation/content";
import { highlightCodeBlocks } from "./navigation/highlight";
import { updateActiveLinks } from "./navigation/links";
import { updateTitle } from "./navigation/title";
import { scrollToFragment } from "./navigation/fragment";

async function navigateToPage(location) {
  await loadContent(location);
  await highlightCodeBlocks();
  updateActiveLinks(location);
  updateTitle();
}

export async function handleHashChange(event) {
  const currentLocation = new Location(event.newURL);
  const previousLocation = new Location(event.oldURL);

  if (currentLocation.page !== previousLocation.page) {
    await navigateToPage(currentLocation);
  }

  scrollToFragment(currentLocation);
}

export async function handleLoad() {
  const currentLocation = new Location(window.location.href);

  await navigateToPage(currentLocation);

  scrollToFragment(currentLocation);
}
