import { render } from "extramark";

/**
 * @param {string} input
 * @returns {string}
 */
export function renderMarkdown(input) {
  return render(input);
}
