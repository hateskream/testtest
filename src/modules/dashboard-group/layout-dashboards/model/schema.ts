import { z } from 'zod';

import type { IDashboard } from './dashboard';
import type { WidgetState } from './widget';
import { rehydrateWidget } from './widget';
import type { IDashboardMeta } from './dashboard-meta.ts';

const WidgetPresetSchema = z.object({
	widgetType: z.string(),
	name: z.string(),
});

export type WidgetPreset = z.infer<typeof WidgetPresetSchema>;

const DisplayVariantSchema = z.enum(['chart', 'tile', 'bar', 'list', 'default', 'indicator', 'heatmap', 'table']);

const WidgetSchema = WidgetPresetSchema.extend({
	id: z.string(),
	defaultStateType: z.string(),
	stateType: z.string().optional(),
	height: z.union([
		z.number(),
		z.literal('Infinity'),
	]),
	displayVariant: DisplayVariantSchema,
	maxCountRow: z.number().optional(),
	state: z.record(z.string(), z.unknown()).optional(),
});

export type Widget = z.infer<typeof WidgetSchema>;

const SectionSchema = z.object({
	id: z.string(),
	name: z.string(),
	width: z.number(),
	widgets: z.array(WidgetSchema),
});

export type Section = z.infer<typeof SectionSchema>;

export const DashboardSchema = z.object({
	id: z.string(),
	name: z.string(),
	sections: z.array(SectionSchema),
	isComingSoon: z.boolean().optional(),
	comingSoonText: z.string().optional(),
});

export type Dashboard = z.infer<typeof DashboardSchema>;

export const DashboardMetaSchema = z.object({
	id: z.string(),
	name: z.string(),
	isComingSoon: z.boolean().optional(),
	comingSoonText: z.string().optional(),
});

export type DashboardMeta = z.infer<typeof DashboardMetaSchema>;

export function hydrateDashboard(data: IDashboard): Dashboard {
	return {
		id: data.id,
		name: data.name,
		sections: data.sections.map((section) => ({
			id: section.id,
			name: section.name,
			width: section.width,
			widgets: section.widgets.map((widget) => ({
				id: widget.id,
				defaultStateType: widget.defaultStateType,
				stateType: widget.stateType,
				widgetType: widget.widgetType,
				name: widget.name,
				height: widget.height === Infinity ? 'Infinity' as const : widget.height,
				maxCountRow: widget.maxCountRow,
				displayVariant: widget.displayVariant,
				state: widget.state,
			})),
		})),
		isComingSoon: data.isComingSoon,
		comingSoonText: data.comingSoonText,
	};
}

export function rehydrateDashboard(data: Dashboard): IDashboard {
	return {
		id: data.id,
		name: data.name,
		sections: data.sections.map(s => ({
			id: s.id,
			name: s.name,
			width: s.width,
			widgets: s.widgets
				.map(w =>
					rehydrateWidget(
						w.id,
						w.widgetType,
						w.height === 'Infinity' ? Infinity : w.height,
						w.displayVariant,
						w.defaultStateType,
						w.stateType,
						w.maxCountRow,
						w.state as WidgetState | undefined,
					))
				.filter(w => w !== null),
		})),
		isComingSoon: data.isComingSoon,
		comingSoonText: data.comingSoonText,
	};
}

export function rehydrateDashboardMeta(data: DashboardMeta): IDashboardMeta {
	return {
		id: data.id,
		name: data.name,
		isComingSoon: data.isComingSoon,
		comingSoonText: data.comingSoonText,
	};
}
