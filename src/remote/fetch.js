import { ResourcePath } from "../utils/resource-path.js";
import { NotFound } from "../utils/http-error/not-found.js";
import { ServerError } from "../utils/http-error/server-error.js";
import { BadRequest } from "../utils/http-error/bad-request.js";
import { HttpError } from "../utils/http-error.js";

import { Data } from "./resource/data.js";
import { Document } from "./resource/document.js";
import { Parsers } from "./parsers.js";

async function resolveResourcePaths(data) {
  if (typeof data !== "object") {
    return;
  }

  for (const field in data) {
    const value = data[field];

    if (value instanceof ResourcePath) {
      // eslint-disable-next-line
      data[field] = await fetchResource(value);
    } else {
      await resolveResourcePaths(value);
    }
  }
}

export async function fetchResource(resourcePath) {
  if (!Object.keys(Parsers).includes(resourcePath.type)) {
    throw new BadRequest(`Invalid resource type requested`, resourcePath);
  }

  const fetchResponse = await window.fetch(resourcePath.url, { cache: "no-cache" });

  if (!fetchResource.ok) {
    if (fetchResponse.status === 404) {
      throw new NotFound();
    } else if (fetchResponse.status === 400) {
      throw new BadRequest();
    } else if (fetchResponse.status >= 500) {
      throw new ServerError();
    }
  }

  try {
    const rawContent = await fetchResponse.text();
    const { type, parse } = Parsers[resourcePath.type];

    let resource;
    if (type === "data") {
      resource = new Data(rawContent, parse);
    } else if (type === "document") {
      resource = new Document(rawContent, parse);
    }

    const data = await resource.getData();
    await resolveResourcePaths(data);

    return resource.resolve();
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new ServerError("Invalid content", error);
  }
}

export async function fetchErrorPage(error) {
  const errorPath = new ResourcePath(error.httpErrorCode, "errors", "md");

  try {
    return await fetchResource(errorPath);
  } catch (_) {
    return error.message;
  }
}
