export default {
  local: {
    get: (keys: string[]) =>
      new Promise((resolve) => {
        const result: { [key: string]: unknown } = {};
        if (Array.isArray(keys)) {
          keys.forEach((key) => {
            result[key] =
              localStorage.getItem(key) ?
                JSON.parse(localStorage.getItem(key) as string)
              : null;
          });
        } else if (typeof keys === "string") {
          result[keys] =
            localStorage.getItem(keys) ?
              JSON.parse(localStorage.getItem(keys) as string)
            : null;
        } else if (typeof keys === "object" && keys !== null) {
          Object.keys(keys).forEach((key) => {
            result[key] =
              localStorage.getItem(key) ?
                JSON.parse(localStorage.getItem(key) as string)
              : keys[key];
          });
        }
        resolve(result);
      }),
    set: (items: object[]) =>
      new Promise(() => {
        for (const key in items) {
          localStorage.setItem(key, JSON.stringify(items[key]));
        }
      }),

    remove: (keys: string[]) =>
      new Promise(() => {
        if (Array.isArray(keys)) {
          keys.forEach((key) => localStorage.removeItem(key));
        } else {
          localStorage.removeItem(keys);
        }
      }),
    clear: () =>
      new Promise(() => {
        localStorage.clear();
      }),
  },
};
