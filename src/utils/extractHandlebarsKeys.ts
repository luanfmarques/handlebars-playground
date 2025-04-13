export function extractHandlebarsKeys(template: string): string[] {
  const keys = new Set<string>();

  const regex =
    /{{\s*(?!else\b)([\w.]+)\s*}}|{{#(?:if|each|with)\s+(?!else\b)([\w.]+)\s*}}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(template))) {
    const key = match[1] || match[2];
    if (key) {
      keys.add(key);
    }
  }

  return Array.from(keys);
}
