import type { Locale } from '../i18n/config';

const MONTHS: Record<Locale, string[]> = {
  pt: ['jan.', 'fev.', 'mar.', 'abr.', 'maio', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};
const PRESENT: Record<Locale, string> = { pt: 'presente', en: 'present' };
const EN_DASH = '–';

function parts(date: string) {
  const [y, m, d] = date.split('-').map(Number);
  return { y, m, d };
}

/** "jul. 2025" / "Jul 2025", "15 jun. 2021" / "15 Jun 2021", or "2025". */
export function formatDate(date: string, locale: Locale): string {
  const { y, m, d } = parts(date);
  if (!m) return String(y);
  const month = MONTHS[locale][m - 1];
  return d ? `${d} ${month} ${y}` : `${month} ${y}`;
}

/** "jul. 2025 – presente", "ago. – set. 2021", "fev. 2021", "2019 – 2020". */
export function formatRange(start: string, end: string | null | undefined, locale: Locale): string {
  if (end === null) return `${formatDate(start, locale)} ${EN_DASH} ${PRESENT[locale]}`;
  if (end === undefined || end === start) return formatDate(start, locale);
  const s = parts(start);
  const e = parts(end);
  if (s.m && e.m && s.y === e.y) return `${MONTHS[locale][s.m - 1]} ${EN_DASH} ${formatDate(end, locale)}`;
  return `${formatDate(start, locale)} ${EN_DASH} ${formatDate(end, locale)}`;
}

/** Sort key for partial dates (missing parts sort as the latest possible value). */
export function dateKey(date: string | null | undefined): string {
  if (date === null) return '9999';
  return date ?? '0000';
}
