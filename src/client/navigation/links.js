import { Location } from "utils/location";

export function updateActiveLinks(currentPage) {
  const linkElements = window.document.querySelectorAll("a[href]");

  for (const linkElement of linkElements) {
    const linkHref = linkElement.getAttribute("href");
    const linkLocation = new Location(linkHref);
    const isLinkActive = linkLocation.page === currentPage;

    if (linkLocation.isAbsolute) {
      continue;
    }

    linkElement.setAttribute("href", linkLocation.getLinkHref(currentPage));
    linkElement.classList.toggle("active", isLinkActive);
  }
}
