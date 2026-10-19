import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { z } from 'astro/zod';

const localised = z.object({ pt: z.string().min(1), en: z.string().min(1) });

const profile = defineCollection({
  loader: file('src/data/profile.yaml'),
  schema: z.object({
    name: z.string(),
    headline: localised,
    profession: localised,
    barNumber: z.string(),
    barLabel: localised,
    city: localised,
    email: z.email(),
    linkedin: z.url(),
  }),
});

export const collections = { profile };
