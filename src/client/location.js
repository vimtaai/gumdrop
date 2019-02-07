export const location = {
  previous: {},
  current: {}
};

export function parseLocation(url) {
  const [page, fragment] = url.replace(/^\/?#!\/?/, "").split("#");

  return { page, fragment };
}

export function updateLocation() {
  location.previous = location.current;
  location.current = parseLocation(window.location.hash);
}
