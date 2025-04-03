enum APP_AUTH {
  COOKIE_AUTH_KEY = 'auth_token',
  COOKIE_AUTH_USER = 'auth_user'
}
enum APP_ERROR {
  SERVER_ERROR = 'Server error',
  SERVER_MAINTAIN = 'Maintenance in progress. We’ll be back shortly!'
}
enum APP_LINK {
  HOME = '/',
  LOGIN = '/login',
  REGISTER = '/register',
  FORGOT_PASSWORD = '/forgot-password',
  WORKSPACES = '/workspaces',
  WORKSPACE = '/workspace',
  CREATE_WORKSPACE = '/workspace/create',
  INVITATION = '/invitation',
  PROFILE = '/profile',
  CALENDAR = '/calendar'
}
export {APP_AUTH, APP_ERROR, APP_LINK}