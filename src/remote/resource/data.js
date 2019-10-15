import { Resource } from "../resource";

export class Data extends Resource {
  constructor(rawData, parse) {
    super(parse);
    this.rawData = rawData;
  }

  async getData() {
    if (this.parsedData !== undefined) {
      return this.parsedData;
    }

    this.parsedData = await this.parse(this.rawData);

    return this.getData();
  }

  async resolve() {
    return this.getData();
  }
}
