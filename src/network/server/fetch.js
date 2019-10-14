import { resources } from "storage/resources";

import { Data } from "utils/resource/data";
import { Resource } from "utils/resource";
import { ResourcePath } from "utils/resource-path";
import { Document } from "utils/resource/document";
import { NotFound } from "utils/http-error/not-found";
import { ServerError } from "utils/http-error/server-error";
import { BadRequest } from "utils/http-error/bad-request";

import { ResourceTypes } from "network/server/parser";
import { HttpError } from "utils/http-error";

export async function fetchResource(resourcePath) {
  if (resourcePath.url in resources) {
    return resources[resourcePath.url];
  }

  if (!Object.keys(ResourceTypes).includes(resourcePath.type)) {
    throw new BadRequest(`Invalid resource type \`${resourcePath.type}\``);
  }

  const fetchResponse = await window.fetch(resourcePath.url, { cache: "no-cache" });

  if (fetchResponse.status === 404) {
    throw new NotFound();
  } else if (fetchResponse.status === 400) {
    throw new BadRequest();
  } else if (fetchResponse.status >= 500) {
    throw new ServerError();
  }

  try {
    const rawContent = await fetchResponse.text();
    const { type, parse } = ResourceTypes[resourcePath.type];

    let resource;
    if (type === "data") {
      resource = new Data(rawContent, parse);
    } else if (type === "document") {
      resource = new Document(rawContent, parse);
    }

    return await resolveResource(resource);
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new ServerError("Invalid content", error);
  }
}

export async function resolveResource(resource) {
  if (!(resource instanceof Resource)) {
    return;
  }

  const data = await resource.getData();

  for (const field in data) {
    const value = data[field];

    if (value instanceof ResourcePath) {
      // eslint-disable-next-line
      data[field] = await fetchResource(value);
    }
  }

  return resource.resolve();
}
