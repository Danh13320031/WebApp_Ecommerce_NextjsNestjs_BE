import { SLUG_REGEX } from '../constants/regex.constant';

const convertTextToSlug = (text: string): string => {
  // Chuyển đổi chữ hoa thành chữ thường
  const slug: string = text
    .toLowerCase()
    .replace(SLUG_REGEX.WHITESPACE_TO_HYPHEN, '-')
    .replace(SLUG_REGEX.NON_ALPHANUMERIC, '');

  return slug;
};

export default convertTextToSlug;
