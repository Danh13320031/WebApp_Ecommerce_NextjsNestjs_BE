export const STRONG_PASSWORD_REGEX: RegExp =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const SLUG_REGEX = {
  WHITESPACE_TO_HYPHEN: /\s+/g,
  NON_ALPHANUMERIC: /[^\w\-]+/g,
};
