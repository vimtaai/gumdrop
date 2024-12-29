export async function importModule(name) {
  const modulePath = import.meta.resolve(`./modules/${name}.js`);
  return import(modulePath);
}
