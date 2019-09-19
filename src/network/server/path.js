const pathRegexp = /^(.+?)?(?:\.([^./]+))?$/;

export class PathData {
  constructor(path, defaultType) {
    const [, file, type] = pathRegexp.exec(path);

    this.file = file;
    this.type = type || defaultType;
  }

  get path() {
    return `${this.file}.${this.type}`;
  }
}
