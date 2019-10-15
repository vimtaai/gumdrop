import { Location } from "local/location";

export function updateActiveLinks(location) {
  const linkElements = document.querySelectorAll("a[href]");

  for (const linkElement of linkElements) {
    const linkHref = linkElement.getAttribute("href");
    const linkLocation = new Location(linkHref);
    const isLinkActive = linkLocation.page === location.page;

    if (linkLocation.isAbsolute) {
      continue;
    }

    linkElement.setAttribute("href", linkLocation.getLinkHref(location.page));
    linkElement.classList.toggle("active", isLinkActive);
  }
}
