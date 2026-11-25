// creates an error with an HTTP status code, e.g. createError(404, 'Menu item not found')
function createError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

module.exports = createError;