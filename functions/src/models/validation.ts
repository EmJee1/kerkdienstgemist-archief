import * as z from "zod";

/**
 * If the RSS feed does not have a title, use this fallback title
 */
const FALLBACK_TITLE = "Ongetitelde kerkdienst";

export const KDGServiceModel = z.object({
  title: z.string().optional().default(FALLBACK_TITLE),
  link: z.string(),
  pubDate: z.string(),

  enclosure: z.object({
    url: z.string(),
  }),

  itunes: z.object({
    author: z.string().optional().nullable(),
  }),
});

export const KDGServiceArrayModel = z.array(KDGServiceModel);
