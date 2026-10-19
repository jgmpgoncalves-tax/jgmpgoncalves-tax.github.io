import type { Locale, RouteKey } from './config';

// Interface strings. Content (bio, experience, publications) lives in src/data and src/content.
export const UI = {
  pt: {
    nav: {
      home: 'Homepage',
      about: 'Sobre',
      practice: 'Áreas de prática',
      publications: 'Publicações',
      news: 'Notícias',
      contact: 'Contactos',
      privacy: 'Política de privacidade',
      legal: 'Aviso legal',
    } satisfies Record<RouteKey, string>,
    menu: 'Menu',
    mainNav: 'Navegação principal',
    langSwitch: 'Idioma',
    switchTo: 'Ver esta página em português',
    skip: 'Saltar para o conteúdo',
    breadcrumbs: 'Localização',
    placeholder: 'Página em construção.',
  },
  en: {
    nav: {
      home: 'Homepage',
      about: 'About',
      practice: 'Practice areas',
      publications: 'Publications',
      news: 'News',
      contact: 'Contact',
      privacy: 'Privacy policy',
      legal: 'Legal notice',
    } satisfies Record<RouteKey, string>,
    menu: 'Menu',
    mainNav: 'Main navigation',
    langSwitch: 'Language',
    switchTo: 'View this page in English',
    skip: 'Skip to content',
    breadcrumbs: 'Breadcrumb',
    placeholder: 'Page under construction.',
  },
} as const satisfies Record<Locale, unknown>;
