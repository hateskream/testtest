import { z } from 'zod';

export const settingsSchema = z.object({
	isShowChart: z.boolean(),
	isShowName: z.boolean(),
	isShowDescription: z.boolean(),
	isShowPastValues: z.boolean(),
});

export type ISettingsSchema = z.infer<typeof settingsSchema>;
