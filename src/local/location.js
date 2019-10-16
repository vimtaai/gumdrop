const urlRegexp = /^([^#]*)(#!)?\/?([^#]*)(#)?(.*)$/;

export class Location {
  constructor(url = "") {
    this.url = url;

    const splitUrl = url.match(urlRegexp);

    if (splitUrl === null) {
      throw new Error("URL parsing failed");
    } else {
      const [, site, hashBangExists, page, hashSignExists, fragment] = splitUrl;

      this.site = site;
      this.page = page || "index";
      this.fragment = fragment;
      this.isAnchor = !this.isAbsolute && !hashBangExists && hashSignExists;
    }
  }

  get isAbsolute() {
    return this.site !== "";
  }

  getLinkHref(currentPage) {
    if (!this.isAnchor) {
      return this.url;
    }

    return `#!/${currentPage}#${this.fragment}`;
  }
}
