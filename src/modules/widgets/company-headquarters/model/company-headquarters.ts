import { z } from 'zod';

export const RegionHeadquartersSchema = z.object({
	region: z.string(),
	image_url: z.string(),
	country_code: z.string(),
	cities: z.array(z.string()),
});

export const CompanyHeadquartersSchema = z.object({
	regions: z.array(RegionHeadquartersSchema).nonempty(),
});

export type RegionHeadquarters = z.infer<typeof RegionHeadquartersSchema>;
export type CompanyHeadquarters = z.infer<typeof CompanyHeadquartersSchema>;
