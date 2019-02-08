import { Location } from "./location";

import { updateContent } from "./navigation/content";
import { updateTitle } from "./navigation/title";
import { updateActiveLinks } from "./navigation/links";
import { scrollToFragment } from "./navigation/fragment";

export async function handleHashChange(event) {
  const previousLocation = new Location(event.oldURL);
  const currentLocation = new Location(event.newURL);

  if (currentLocation.page !== previousLocation.page) {
    await updateContent(currentLocation.page);
    updateActiveLinks(currentLocation.page);
    updateTitle();
  }

  scrollToFragment(currentLocation.fragment);
}

export async function handleLoad() {
  const currentLocation = new Location(window.location.href);

  await updateContent(currentLocation.page);
  updateActiveLinks(currentLocation.page);
  updateTitle();

  scrollToFragment(currentLocation.fragment);
}
