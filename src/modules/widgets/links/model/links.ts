import { z } from 'zod';

export const WebsiteSchema = z.object({
	label: z.string(),
	link: z.string(),
});

export const SocialsItemSchema = z.object({
	logoUrl: z.string(),
	link: z.string(),
});

export const LinksSchema = z.object({
	tickerId: z.string(),
	website: WebsiteSchema.optional(),
	socials: z.array(SocialsItemSchema).optional(),
	tags: z.array(z.string()).optional(),
});

export type Links = z.infer<typeof LinksSchema>;
