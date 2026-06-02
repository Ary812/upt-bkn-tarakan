import sanitizeHtml from 'sanitize-html';

export function sanitizeContent(rawHtml) {
  if (!rawHtml) return '';
  
  return sanitizeHtml(rawHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'p', 'figure', 'figcaption',
      'table', 'thead', 'tbody', 'tr', 'th', 'td', 'ul', 'ol', 'li', 'strong', 'b', 'i', 'em', 'u', 's', 'strike',
      'blockquote', 'pre', 'hr', 'br', 'div', 'iframe'
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['style', 'class'],
      'img': ['src', 'alt', 'width', 'height', 'style'],
      'a': ['href', 'name', 'target', 'rel'],
      'iframe': ['src', 'width', 'height', 'frameborder', 'allowfullscreen', 'title'],
    },
    allowedSchemes: ['https', 'http', 'data'],
    allowedIframeHostnames: ['www.youtube.com', 'drive.google.com', 'docs.google.com']
  });
}
