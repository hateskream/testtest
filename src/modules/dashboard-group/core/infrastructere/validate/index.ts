import { z } from 'zod';

const PositionSchema = z.object({
	x: z.number(),
	y: z.number(),
	w: z.number(),
	h: z.number(),
});

export type Position = z.infer<typeof PositionSchema>;

const WidgetSchema = z.object({
	id: z.string(),
	type: z.string(),
	position: PositionSchema,
});

export type Widget = z.infer<typeof WidgetSchema>;

const DashboardSchema = z.object({
	id: z.string(),
	name: z.string(),
	order: z.number(),
	activeColNum: z.number(),
	layout:  z.record(z.array(WidgetSchema)),
});

export type Dashboard = z.infer<typeof DashboardSchema>;

export const DashboardGroupSchema = z.object({
	activeDashboardId: z.string(),
	dashboards: z.array(DashboardSchema),
});

export type DashboardGroup = z.infer<typeof DashboardGroupSchema>;
