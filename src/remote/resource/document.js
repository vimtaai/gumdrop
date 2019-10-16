import { Imports } from "storage/imports";

import { Data } from "remote/resource/data";
import { parseYaml } from "remote/parsers/yaml";
import { parseJson } from "remote/parsers/json";

import { Resource } from "../resource";

const frontMatterRegexp = /^---[ \t]*(\r?\n.*?\r?\n|\r?\n)---[ \t]*\r?\n(.*)$/s;

export class Document extends Resource {
  constructor(rawData, parse) {
    super(parse);

    const splitDocument = frontMatterRegexp.exec(rawData);

    if (splitDocument === null) {
      this.context = new Data("{}", parseJson);
      this.template = rawData;
    } else {
      const [, context, template] = splitDocument;

      this.context = new Data(context, parseYaml);
      this.template = template;
    }
  }

  async getData() {
    return this.context.getData();
  }

  async resolve() {
    const Mustache = await Imports.get("mustache");

    const renderedTemplate = Mustache.render(this.template, await this.getData());

    return this.parse(renderedTemplate);
  }
}
