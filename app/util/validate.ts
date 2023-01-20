export function notMatched(value: string | undefined, regexp: RegExp) {
  return !value || !value.match(regexp);
}

export function notFound(value: any) {
  return !value || value.length === 0 || Object.keys(value).length === 0;
}
