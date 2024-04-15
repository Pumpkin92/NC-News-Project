const endpointData = require("../endpoints.json");

function getEndpoints(req, res, next) {
  res.status(200).send(endpointData);
}

module.exports = { getEndpoints };
