export const extractTitle = (html: string): string | undefined => {
  const titleTagRegex = /<title[^>]*>([\s\S]*?)<\/title>/i;
  const match = html.match(titleTagRegex);
  if (match && match[1]) {
    return match[1].trim();
  }
  return undefined;
};

export const extractEmail = (html: string): string | undefined => {
  const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/;
  const match = html.match(emailRegex);
  if (match) {
    return match[0];
  }
  return undefined;
};

export const extractLastUrl = (text: string): string | null => {
  const urlRegex =
    /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
  const matches = text.match(urlRegex);
  const lastMatch = matches ? matches[matches.length - 1] : null;
  return lastMatch;
};
