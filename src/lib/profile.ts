import { getEntry } from 'astro:content';

export async function getProfile() {
  const entry = await getEntry('profile', 'main');
  if (!entry) throw new Error('src/data/profile.yaml must contain an entry with id "main".');
  return entry.data;
}
