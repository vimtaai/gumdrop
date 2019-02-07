import { location, parseLocation } from "../location";

export function updateHash(href) {
  const { fragment } = parseLocation(href);
  const { page } = location.current;

  window.location.hash = "#!/" + page + "#" + fragment;
}
