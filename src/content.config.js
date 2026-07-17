import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const sharedSchema = z
  .object({
    title: z.string(),
    date: z.coerce.date().optional(),
    ingested: z.coerce.date().optional(),
    updated: z.coerce.date().optional(),
    publicOrder: z.number().optional(),
    tags: z.array(z.string()).default([]),
    summary: z.string().optional(),
    series: z.string().optional(),
  })
  .passthrough();

export const collections = {
  articles: defineCollection({
    loader: glob({ base: "./src/content/articles", pattern: "**/*.md" }),
    schema: sharedSchema,
  }),
  topics: defineCollection({
    loader: glob({ base: "./src/content/topics", pattern: "**/*.md" }),
    schema: sharedSchema,
  }),
};
