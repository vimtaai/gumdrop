const urlRegexp = /^([^#]*)(#!)?\/?([^#]*)(#)?(.*)/;

export class Location {
  constructor(url = "") {
    const [, site, hashBangExists, page, hashSignExists, fragment] = url.match(urlRegexp);

    this.url = url;
    this.site = site;
    this.page = page || "index";
    this.fragment = fragment;
    this.isAbsolute = site !== "";
    this.isAnchor = !this.isAbsolute && !hashBangExists && hashSignExists;
  }

  getLinkHref(currentPage) {
    if (!this.isAnchor) {
      return this.url;
    }

    return `#!/${currentPage}#${this.fragment}`;
  }
}
