// HTTP Status Codes
export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

// API Messages
export const MESSAGES = {
  // Auth Messages
  LOGIN_SUCCESS: 'Login successful',
  REGISTRATION_SUCCESS: 'User created successfully',
  INVALID_CREDENTIALS: 'Invalid credentials',
  USER_EXISTS: 'User already exists',
  UNAUTHORIZED: 'Unauthorized',
  
  // Movie Messages
  MOVIES_RETRIEVED: 'Movies retrieved successfully',
  MOVIE_CREATED: 'Movie created successfully',
  MOVIE_UPDATED: 'Movie updated successfully',
  MOVIE_DELETED: 'Movie deleted successfully',
  MOVIE_NOT_FOUND: 'Movie not found',
  
  // Validation Messages
  REQUIRED_FIELDS: 'Required fields are missing',
  EMAIL_PASSWORD_REQUIRED: 'Email and password are required',
  NAME_EMAIL_PASSWORD_REQUIRED: 'Name, email and password are required',
  TITLE_YEAR_REQUIRED: 'Title and publishing year are required',
  
  // Error Messages
  LOGIN_FAILED: 'Login failed',
  REGISTRATION_FAILED: 'Registration failed',
  MOVIES_FETCH_FAILED: 'Failed to retrieve movies',
  MOVIE_CREATE_FAILED: 'Failed to create movie',
  MOVIE_UPDATE_FAILED: 'Failed to update movie',
  MOVIE_DELETE_FAILED: 'Failed to delete movie'
} as const;
