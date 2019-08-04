module.exports = {
  AUTH_OK: {
    status: 200,
    success: true,
    message: "Authentication successful.",
  },
  GENERIC_OK: {
    status: 200,
    success: true,
    message: "Success",
  },
  BAD_REQUEST: {
    status: 400,
    success: false,
    message: "Bad Request",
  },
  MISSING_CREDENTIALS: {
    status: 401,
    success: false,
    message: "Username and/or password not provided.",
  },
  INVALID_CREDENTIALS: {
    status: 401,
    success: false,
    message: "Invalid username or password.",
  },
  FORBIDDEN: {
    status: 403,
    success: false,
    message: "Forbidden",
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    success: false,
    message: "An internal error occurred.",
  },
};
