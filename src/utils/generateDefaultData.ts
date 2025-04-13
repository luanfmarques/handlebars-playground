export function generateDefaultData(keys: string[]): Record<string, unknown> {
  return keys.reduce((acc, key) => {
    const keyStartsWithIs =
      key.startsWith("is") && key.length > 2 && key[2] === key[2].toUpperCase();
    const keyStartsWithHas =
      key.startsWith("has") &&
      key.length > 3 &&
      key[3] === key[3].toUpperCase();
    if (keyStartsWithIs || keyStartsWithHas) {
      acc[key] = false;
    } else {
      acc[key] = "";
    }
    return acc;
  }, {} as Record<string, unknown>);
}
