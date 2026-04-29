/** Util mínima para combinar clases condicionales sin dependencias. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
