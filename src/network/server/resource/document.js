import { imports } from "./node_modules/storage/imports";

import { Data } from "./node_modules/utils/resource/data";
import { Resource } from "./node_modules/utils/resource";

import { parseYaml } from "./node_modules/network/server/parsers/yaml";
import { parseJson } from "../../network/server/parsers/json";

const frontMatterRegexp = /^---[ \t]*(\r?\n.*\r?\n|\r?\n)---[ \t]*\r?\n(.*)$/s;

export class Document extends Resource {
  constructor(rawData, parse) {
    super(parse);

    const splitDocument = frontMatterRegexp.exec(rawData);

    if (splitDocument === null) {
      this.context = new Data("{}", parseJson);
      this.template = rawData;
    } else {
      const [, context, template] = splitDocument;
      this.template = template;
      this.context = new Data(context, parseYaml);
    }
  }

  async getData() {
    return this.context.getData();
  }

  async resolve() {
    const Mustache = await imports.mustache;

    const renderedTemplate = Mustache.render(this.template, await this.getData());

    return this.parse(renderedTemplate);
  }
}
