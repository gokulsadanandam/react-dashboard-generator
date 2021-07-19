export const DBConfig = {
  name: "TechChallenge",
  version: 1,
  objectStoresMeta: [
    {
      store: "users",
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "username", keypath: "username", options: { unique: true } },
        { name: "password", keypath: "password", options: { unique: false } },
        { name: "role", keypath: "role", options: { unique: false } }
      ]
    }
  ]
};
