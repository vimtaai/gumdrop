const HASHBANG_SEPARATOR = /^#!\/?/;
const FRAGMENT_SEPARATOR = /(?<!#.*)#/;
const EXTENSION_SEPARATOR = /\.(?!.*\.)/;
const DEFAULT_PAGE = "index";
const DEFAULT_EXTENSION = "md";

export function parseLocation(location) {
  const hash = location.hash.replace(HASHBANG_SEPARATOR, "");
  const [path, fragment] = hash.split(FRAGMENT_SEPARATOR);
  const [page, extension] = path.split(EXTENSION_SEPARATOR);

  return {
    page: page || DEFAULT_PAGE,
    extension: extension || DEFAULT_EXTENSION,
    fragment: fragment || "",
  };
}
