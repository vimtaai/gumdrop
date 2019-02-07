import { location, parseLocation } from "../../location";

export function updateActiveLinks() {
  const links = document.querySelectorAll("a[href]");
  const { page: currentPage } = location.current;

  for (const link of links) {
    const href = link.getAttribute("href");

    if (!href.match(/^\/?#!/)) {
      continue;
    }

    const { page: hrefPage } = parseLocation(href);

    link.classList.toggle("active", currentPage === hrefPage);
  }
}
