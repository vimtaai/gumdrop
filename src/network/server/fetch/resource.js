const defaultError = `<h1>404 - Not found</h1>`;

export async function fetchResource(folder, name, type, defaultValue) {
  const response = await window.fetch(`${folder}/${name}.${type}`, { cache: "no-cache" });

  if (!response.ok) {
    return defaultValue || (await fetchResource("errors", response.status, "md", defaultError));
  }

  return response.text();
}
