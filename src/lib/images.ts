import type { ImageMetadata } from 'astro';
import placeholder from '../assets/profile-placeholder.svg';

// Optional images. Each slot is used when its file exists in src/assets/:
//   profile.jpg                       profile photo (home); neutral placeholder otherwise
//   banners/<slot>.jpg                page banners; solid navy block otherwise
//   strip.jpg                         full-width strip on the home page; not rendered otherwise
// Any of .jpg, .jpeg, .png or .webp works.
type Module = { default: ImageMetadata };
const profile = import.meta.glob<Module>('../assets/profile.{jpg,jpeg,png,webp}', { eager: true });
const banners = import.meta.glob<Module>('../assets/banners/*.{jpg,jpeg,png,webp}', { eager: true });
const strip = import.meta.glob<Module>('../assets/strip.{jpg,jpeg,png,webp}', { eager: true });

export type BannerSlot = 'inicio' | 'sobre' | 'publicacoes' | 'contactos';

export const profilePhoto: { src: ImageMetadata; isPlaceholder: boolean } = (() => {
  const found = Object.values(profile)[0];
  return found ? { src: found.default, isPlaceholder: false } : { src: placeholder, isPlaceholder: true };
})();

export function bannerImage(slot: BannerSlot): ImageMetadata | undefined {
  const entry = Object.entries(banners).find(([path]) => path.split('/').pop()!.replace(/\.\w+$/, '') === slot);
  return entry?.[1].default;
}

export const stripImage: ImageMetadata | undefined = Object.values(strip)[0]?.default;
