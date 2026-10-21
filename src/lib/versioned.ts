import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { asset } from '../i18n/utils';

// Path of a file in public/ with a fingerprint of its content (?v=...). When the file changes,
// the URL changes, so browsers and social networks (LinkedIn, WhatsApp...) fetch the new
// version instead of a cached copy. Used for the favicon and the share image.
const cache = new Map<string, string>();

export function versioned(path: string): string {
  if (!cache.has(path)) {
    const hash = createHash('sha256').update(readFileSync(`public/${path}`)).digest('hex').slice(0, 10);
    cache.set(path, `${asset(path)}?v=${hash}`);
  }
  return cache.get(path)!;
}
