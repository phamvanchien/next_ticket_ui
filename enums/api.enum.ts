enum API_METHOD_ENUM {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

enum API_CODE {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  CREATED = 201,
  VALIDATE_FAILED = 422
}

enum API_MESSAGE {
  OK = 'Success',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  CREATED = 'CREATED',
  VALIDATE_FAILED = 'VALIDATE_FAILED'
}

export { API_METHOD_ENUM, API_CODE, API_MESSAGE }