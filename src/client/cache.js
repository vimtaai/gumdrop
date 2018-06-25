export const cache = {
  store: {},

  containsFolder(folder) {
    return this.store.hasOwnProperty(folder);
  },

  contains(folder, name) {
    if (!this.containsFolder(folder)) {
      return false;
    }

    return this.store[folder].hasOwnProperty(name);
  },

  get(folder, name) {
    if (!this.containsFolder(folder)) {
      return undefined;
    }

    return this.store[folder][name];
  },

  set(folder, name, value) {
    if (!this.containsFolder(folder)) {
      this.store[folder] = {};
    }

    this.store[folder][name] = value;
  },
}

export default cache;