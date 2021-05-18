export function isString(field: any): field is String {
  return Object.prototype.toString.call(field) === "[object String]";
}

export function capitalizeName(name: string): string {
  return `${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}
