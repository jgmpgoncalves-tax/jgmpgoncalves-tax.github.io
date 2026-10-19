import type { ImageMetadata } from 'astro';
import placeholder from '../assets/profile-placeholder.svg';

// Uses src/assets/profile.jpg when it exists, otherwise a neutral placeholder.
const photos = import.meta.glob<{ default: ImageMetadata }>('../assets/profile.{jpg,jpeg,png,webp}', { eager: true });

export const profilePhoto: { src: ImageMetadata; isPlaceholder: boolean } = (() => {
  const found = Object.values(photos)[0];
  return found ? { src: found.default, isPlaceholder: false } : { src: placeholder, isPlaceholder: true };
})();
