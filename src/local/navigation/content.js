import { ResourcePath } from "../../utils/resource-path.js";
import { Site } from "../../storage/site.js";
import { Resources } from "../../storage/resources.js";

const timeoutUntilLoader = 500;

export async function loadContent(location) {
  const contentPath = new ResourcePath(location.page, "pages", "md");

  const loaderTimer = window.setTimeout(function() {
    Site.root.innerHTML = Site.loader;
  }, timeoutUntilLoader);

  Site.root.innerHTML = await Resources.get(contentPath);

  window.clearTimeout(loaderTimer);
}
