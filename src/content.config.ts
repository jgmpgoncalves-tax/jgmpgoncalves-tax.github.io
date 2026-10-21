import { defineCollection, reference } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Shared field types.
const text = z.string().min(1);
const localised = z.strictObject({ pt: text, en: text });
// "YYYY", "YYYY-MM" or "YYYY-MM-DD". Years written without quotes are accepted too.
const partialDate = z
  .union([z.string(), z.number()])
  .transform(String)
  .pipe(z.string().regex(/^\d{4}(-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?)?$/, 'Use YYYY, YYYY-MM or YYYY-MM-DD'));
const todo = z.array(text).optional();

const profile = defineCollection({
  loader: file('src/data/profile.yaml'),
  schema: z.object({
    name: text,
    citationName: z.strictObject({ surname: text, given: text }),
    role: localised,
    employer: localised,
    firm: text,
    formerEmployers: z.array(text),
    city: localised,
    country: localised,
    heroLine: localised,
    headline: localised,
    description: localised,
    profession: localised,
    barNumber: text,
    barLabel: localised,
    dissertation: z.strictObject({
      title: localised,
      status: z.enum(['pending-defence', 'defended']),
      defenceYear: z.number().int().nullable(),
      text: z.strictObject({ 'pending-defence': localised, defended: localised }),
    }),
    alumniOf: z.array(text),
    email: z.email(),
    contactForm: z.url().optional(),
    linkedin: z.url(),
  }),
});

// General description: src/content/description/<pt|en>.md. Home text in the frontmatter,
// About paragraphs in the body. {dissertation} is filled in from profile.yaml.
const description = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/description' }),
  schema: z.object({ home: z.array(text).min(1) }),
});

const researchAreas = defineCollection({
  loader: file('src/data/research-areas.yaml'),
  schema: z.object({ order: z.number().int(), label: localised }),
});

const research = defineCollection({
  loader: file('src/data/research.yaml'),
  schema: z.object({
    organisation: text,
    role: localised,
    start: partialDate,
    end: partialDate.nullable(),
  }),
});

const publications = defineCollection({
  loader: file('src/data/publications.yaml'),
  schema: z.object({
    title: text,
    venue: text,
    edition: localised.optional(),
    volume: text.optional(),
    pages: text.optional(),
    date: partialDate.optional(),
    coauthors: z.array(text).optional(),
    url: z.url().optional(),
    todo,
  }),
});

const practiceAreas = defineCollection({
  loader: file('src/data/practice-areas.yaml'),
  schema: z.object({ order: z.number().int(), title: localised, text: localised }),
});

const articleTypes = defineCollection({
  loader: file('src/data/article-types.yaml'),
  schema: z.object({ label: localised, schema: z.enum(['ScholarlyArticle', 'Article']) }),
});

// Articles (own texts, opinion and reflections, not peer-reviewed): src/content/articles/<pt|en>/<slug>.md,
// published at /articles/<slug>/ and /pt/artigos/<slug>/. Never rename a published file.
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: text,
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    summary: text,
    type: reference('articleTypes'),
    tags: z.array(text).default([]),
    translationOf: text.optional(),
    pdf: text.optional(),
    draft: z.boolean().default(false),
  }),
});

const newsCategories = defineCollection({
  loader: file('src/data/news-categories.yaml'),
  schema: z.object({ label: localised }),
});

// News and talks: src/content/news/<pt|en>/<slug>.md. Items in the "talk" category
// also appear on the Talks page. The body is the text shown in the lists.
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      date: z.coerce.date(),
      category: reference('newsCategories'),
      title: text,
      link: z.url().optional(),
      image: image().optional(),
      imageAlt: text.optional(),
      translationOf: text.optional(),
      draft: z.boolean().default(false),
    }),
});

// Privacy policy and legal notice: src/content/legal/<locale>/<privacy|legal>.md.
const legal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/legal' }),
  schema: z.object({ title: text, draft: z.boolean().default(false), updated: z.coerce.date() }),
});

export const collections = {
  profile,
  description,
  researchAreas,
  research,
  publications,
  practiceAreas,
  articleTypes,
  articles,
  newsCategories,
  news,
  legal,
};
