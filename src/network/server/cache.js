export class Cache {
  constructor() {
    this.store = {};
  }

  containsFolder(folder) {
    return folder in this.store;
  }

  contains(folder, name) {
    if (!this.containsFolder(folder)) {
      return false;
    }

    return name in this.store[folder];
  }

  get(folder, name) {
    if (!this.containsFolder(folder)) {
      return undefined;
    }

    return this.store[folder][name];
  }

  set(folder, name, value) {
    if (!this.containsFolder(folder)) {
      this.store[folder] = {};
    }

    this.store[folder][name] = value;
    return value;
  }
}

export const cache = new Cache();
