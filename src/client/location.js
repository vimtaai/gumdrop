export function parseLocation(url) {
  const [page, fragment] = url.replace(/^\/?#!\/?/, "").split("#");

  return { page, fragment };
}

export function getCurrentLocation() {
  return parseLocation(window.location.hash);
}
