import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Shared field types.
const text = z.string().min(1);
const localised = z.object({ pt: text, en: text });
const localisedList = z.object({ pt: z.array(text), en: z.array(text) });
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
    headline: localised,
    description: localised,
    profession: localised,
    barNumber: text,
    barLabel: localised,
    barAdmission: z.object({ year: z.number().int(), council: localised }),
    city: localised,
    email: z.email(),
    linkedin: z.url(),
    bio: localisedList,
    languages: z.array(localised),
  }),
});

const experience = defineCollection({
  loader: file('src/data/experience.yaml'),
  schema: z.object({
    organisation: text,
    city: localised,
    start: partialDate,
    end: partialDate.nullable(),
    internship: z.boolean().default(false),
    position: localised.optional(),
    roles: z
      .array(z.object({ title: localised, start: partialDate.optional(), end: partialDate.nullable().optional() }))
      .min(1),
    description: localisedList.optional(),
    supervisor: text.optional(),
  }),
});

const education = defineCollection({
  loader: file('src/data/education.yaml'),
  schema: z.object({
    programme: localised,
    institution: text,
    city: localised,
    start: partialDate,
    end: partialDate.nullable(),
    notes: localisedList.optional(),
    dissertation: z
      .object({
        title: localised,
        supervisor: localised,
        status: z.enum(['pending-defence', 'defended']),
        defenceDate: partialDate.nullable().optional(),
        grade: text.nullable().optional(),
      })
      .optional(),
  }),
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

const training = defineCollection({
  loader: file('src/data/training.yaml'),
  schema: z.object({
    title: text,
    organiser: text.optional(),
    teacher: text.optional(),
    date: partialDate.optional(),
    result: text.optional(),
    notes: localisedList.optional(),
    todo,
  }),
});

const practiceAreas = defineCollection({
  loader: file('src/data/practice-areas.yaml'),
  schema: z.object({ order: z.number().int(), title: localised, text: localised }),
});

// News: one Markdown file per language, same file name in news/pt/ and news/en/.
const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    date: z.coerce.date(),
    category: text,
    title: text,
    link: z.url().optional(),
  }),
});

export const collections = { profile, experience, education, research, publications, training, practiceAreas, news };
