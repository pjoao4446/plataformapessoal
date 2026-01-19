/**
 * Utility function para combinar classes CSS (similar ao clsx/classnames)
 * Útil para condicionalmente aplicar classes do Tailwind
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}







