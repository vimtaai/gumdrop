import { location } from "../location";
import { updateContent } from "./page/content";
import { updateTitle } from "./page/title";
import { updateActiveLinks } from "./page/links";

export async function updatePage() {
  if (location.current.page === location.previous.page) {
    return;
  }

  await updateContent();
  updateTitle();
  updateActiveLinks();
}
