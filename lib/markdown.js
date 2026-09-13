import { render } from "extramark";

/**
 * @param {string} source
 * @returns {string}
 */
export function renderMarkdown(source) {
  return render(source);
}
