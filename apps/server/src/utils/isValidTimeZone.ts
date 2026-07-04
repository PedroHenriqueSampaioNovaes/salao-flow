export function isValidTimeZone(timeZone: string): boolean {
  return Intl.supportedValuesOf('timeZone').includes(timeZone);
}
