const res = require("express/lib/response");
const { getJsonEndpoints } = require("../models/api.model");

exports.getEndpoints = (req, res, next) => {
  getJsonEndpoints()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};
