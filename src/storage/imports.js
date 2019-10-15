import { NotFound } from "utils/http-error/not-found";
import { ServerError } from "utils/http-error/server-error";
import { BadRequest } from "utils/http-error/bad-request";

import { dependencies } from "dependencies";
import { parseJS } from "remote/parsers/javascript";

const cdnRoot = "https://cdn.jsdelivr.net/npm/";

export const Imports = {
  _imports: {},
  async get(importName) {
    if (importName in this._imports) {
      return this._imports[importName];
    }

    if (!(importName in dependencies)) {
      throw new Error(`Unknown dependency ${importName}.`);
    }

    const dependency = dependencies[importName];
    const url = `${importName}@${dependency.version}/${dependency.path}`;

    const fetchResponse = await window.fetch(cdnRoot + url);

    if (!fetchResponse.ok) {
      const errorMessage = `Could not load dependency ${importName} from ${cdnRoot}`;

      if (fetchResponse.status === 404) {
        throw new NotFound(errorMessage);
      } else if (fetchResponse.status === 400) {
        throw new BadRequest(errorMessage);
      } else if (fetchResponse.status >= 500) {
        throw new ServerError(errorMessage);
      }
    }

    const sourceCode = await fetchResponse.text();
    // eslint-disable-next-line
    this._imports[importName] = parseJS(sourceCode, dependency.export);

    return this._imports[importName];
  }
};
