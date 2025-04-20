const HASHBANG_SEPARATOR = /^#!\/?/;
const FOLDER_SEPARATOR = /\/[^\/]*$/;
const FRAGMENT_SEPARATOR = /(?<!#.*)#/;
const EXTENSION_SEPARATOR = /\.(?!.*\.)/;
const DEFAULT_PAGE = "index";
const DEFAULT_EXTENSION = "md";

export function parseLocation(location) {
  const { protocol, origin, pathname, hash } = location;

  const hashBang = hash.replace(HASHBANG_SEPARATOR, "");
  const baseDir = pathname.replace(FOLDER_SEPARATOR, "");
  const baseUrl = protocol !== "file:" ? origin + baseDir : baseDir;

  return { baseUrl, hashBang };
}

export function parseHashBang(hashBang) {
  const [path, fragment] = hashBang.split(FRAGMENT_SEPARATOR);
  const [page, extension] = path.split(EXTENSION_SEPARATOR);

  return {
    page: page || DEFAULT_PAGE,
    extension: extension || DEFAULT_EXTENSION,
    fragment: fragment || "",
  };
}
