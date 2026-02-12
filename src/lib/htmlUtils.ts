// src/lib/htmlUtils.ts

/**
 * Utility function to strip HTML tags from text
 * @param html - HTML string to clean
 * @returns Clean text without HTML tags
 */
export const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

/**
 * Utility function to decode HTML entities
 * @param html - HTML string with entities
 * @returns Decoded text
 */
export const decodeHtmlEntities = (html: string): string => {
  if (!html) return '';
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
};

/**
 * Comprehensive function to clean HTML content for display
 * @param html - HTML string to clean
 * @returns Clean, decoded text
 */
export const cleanHtmlContent = (html: string): string => {
  if (!html) return '';
  const stripped = stripHtmlTags(html);
  return decodeHtmlEntities(stripped);
};