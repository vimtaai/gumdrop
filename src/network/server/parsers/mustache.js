import { imports } from "network/remote/imports";

export async function parseMustache(template, context = null) {
  const Mustache = await imports.mustache;

  return Mustache.render(template, context);
}
