import { currentLocation, parseLocation } from "./location";

export function handleLinkClick(event) {
  const target = event.target.closest("a");

  if (target === null) {
    return;
  }

  const href = target.getAttribute("href");

  if (!href.match(/^\/?#/)) {
    return;
  }

  event.preventDefault();

  if (href.match(/^\/?#!/)) {
    const { page, fragment } = parseLocation(href);
    window.location.hash = "#!/" + page + (fragment ? "#" + fragment : "");
  } else {
    const { fragment } = parseLocation(href);
    const { page } = currentLocation();
    window.location.hash = "#!/" + page + "#" + fragment;
  }
}
