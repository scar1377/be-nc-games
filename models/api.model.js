const { readFile } = require("fs/promises");

exports.getJsonEndpoints = () => {
  return readFile("./endpoints.json", "utf-8").then((endpoints) => {
    return JSON.parse(endpoints);
  });
};
