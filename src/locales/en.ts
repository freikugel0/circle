export const en = {
  // Auth page form validation
  EMAIL_INVALID: "Email is invalid",
  PASSWORD_MIN: "Password must be at least 8 characters",
  REPEAT_PASSWORD_REQUIRED: "Repeat password is required",
  PASSWORD_MISMATCH: "Passwords do not match",
  USERNAME_MIN: "Username must be at least 5 characters",
  USERNAME_MAX: "Username must be at most 20 characters",
  USERNAME_REQUIRED: "Username is required",
  PASSWORD_REQUIRED: "Password is required",

  // Time ago in thread list
  TIME: {
    seconds: "{{count}}s ago",
    minutes: "{{count}}m ago",
    hours: "{{count}}h ago",
    days: "{{count}}d ago",
    months: "{{count}}mo ago",
    years: "{{count}}y ago",
  },

  // Index page (thread list)
  THREAD_TITLE_EMPTY: "Thread title can't be empty",
  THREAD_TITLE_TOO_LONG: "Thread title maximum is 150 characters",
  THREAD_CONTENT_EMPTY: "Thread content can't be empty",
  THREAD_CONTENT_TOO_LONG: "Thread content maximum is 1000 characters",

  // Thread detail page (reply list)
  REPLY_CONTENT_EMPTY: "Reply content can't be empty",
  REPLY_CONTENT_TOO_LONG: "Reply content maximum is 1000 characters",

  // User edit form dialog
  FULLNAME_MIN: "Full name must not be empty",
  FULLNAME_MAX: "Full name must be at most 50 characters",
  BIO_MAX: "Bio must be at most 160 characters",

  // API
  API_NOT_FOUND: "API endpoint not found",
  API_UNEXPECTED_ERROR: "Unexpected server error",
  API_LIMIT_EXCEEDED: "Request limit exceeded",

  // File
  FILE_TOO_LARGE: "File is too large, max 3MB",
  FILE_UPLOAD_FAILED: "File upload failed",
  FILE_INVALID_TYPE: "Invalid file type",

  // Auth
  AUTH_TOKEN_MISSING: "Authentication token is missing",
  AUTH_TOKEN_INVALID: "Invalid authentication token",
  AUTH_UNAUTHORIZED: "You are not authorized",
  AUTH_FORBIDDEN: "Access forbidden",
  AUTH_VALIDATION_ERROR: "Validation error",

  // Register
  AUTH_EMAIL_ALREADY_REGISTERED: "Email is already registered",

  // Login
  AUTH_USER_NOT_FOUND: "User not found",
  AUTH_INCORRECT_PASSWORD: "Incorrect password",

  // Reset
  AUTH_RESET_TOKEN_INVALID: "Reset token is invalid",
};
