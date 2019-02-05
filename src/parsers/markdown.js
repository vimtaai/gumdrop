export async function parseMarkdown(response) {
  return ExtraMark.render(await response.text());
}
