import { Location } from "utils/location";

import { updateContent } from "./navigation/content";
import { updateTitle } from "./navigation/title";
import { updateActiveLinks } from "./navigation/links";
import { scrollToFragment } from "./navigation/fragment";

async function navigateToPage(location) {
  await updateContent(location);
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
