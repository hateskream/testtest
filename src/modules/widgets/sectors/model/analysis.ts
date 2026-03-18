import { z } from 'zod';

export const SectorsAnalysisSchema = z.object({
	tickerId: z.string(),
	summary: z.string(),
});

export type SectorsAnalysis = z.infer<typeof SectorsAnalysisSchema>;
