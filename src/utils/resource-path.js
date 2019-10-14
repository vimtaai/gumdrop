const pathRegexp = /^(\/)?(.+?)?(?:\.([^./]+))?$/;

export class ResourcePath {
  constructor(path, defaultFolder, defaultType) {
    const [, isAbsolute, file, type] = pathRegexp.exec(path);

    this.file = isAbsolute ? file : `${defaultFolder}/${file}`;
    this.type = type || defaultType;
  }

  get url() {
    return `${this.file}.${this.type}`;
  }
}
