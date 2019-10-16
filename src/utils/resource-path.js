const pathRegexp = /^(\/)?(.+?)?(?:\.([^./]+))?$/;

export class ResourcePath {
  constructor(path, defaultFolder, defaultType) {
    const splitPath = pathRegexp.exec(path);

    if (splitPath === null) {
      this.file = path;
      this.type = defaultType;
    } else {
      const [, isAbsolute, file, type] = splitPath;

      this.file = isAbsolute ? file : `${defaultFolder}/${file}`;
      this.type = type || defaultType;
    }
  }

  get url() {
    return `${this.file}.${this.type}`;
  }
}
