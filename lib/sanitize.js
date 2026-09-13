import createDOMPurify from "dompurify";

/**
 * @param {Window} window
 * @returns {(html: string) => string}
 */
export function createSanitizer(window) {
  const DOMPurify = createDOMPurify(window);
  return (html) => DOMPurify.sanitize(html);
}
