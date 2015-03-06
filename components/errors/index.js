/**
 * Error responses
 */

'use strict';

module.exports[404] = function pageNotFound(req, res) {
  var viewFilePath = '404';
  var statusCode = 404;
  var result = {
    status: statusCode,
    error: "Page Not Found"

  };

  res.status(result.status).json(result);
};

module.exports[500] = function internalError(req, res) {
  var viewFilePath = '500';
  var statusCode = 500;
  var result = {
    status: statusCode,
    error: "Internal Error"

  };

  res.status(result.status).json(result);
};