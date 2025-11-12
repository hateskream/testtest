import { computed, ref, watch } from 'vue';
import { z } from 'zod';

import {
	createDashboardGroup,
	type IDashboardGroup,
	type IDashboardTab,
	type ISection,
	rehydrateWidget,
} from '../model';
import { createStateQueries } from '@/shared/service/data-repo';

const WidgetPresetSchema = z.object({
	widgetType: z.string(),
	name: z.string(),
});

export type WidgetPreset = z.infer<typeof WidgetPresetSchema>;

const DisplayVariantSchema = z.enum(['chart', 'tile', 'bar', 'list', 'default']);

const WidgetSchema = WidgetPresetSchema.extend({
	id: z.string(),
	defaultStateType: z.string(),
	height: z.number(),
	displayVariant: DisplayVariantSchema,
	maxCountRow: z.number().optional(),
});

export type Widget = z.infer<typeof WidgetSchema>;

const SectionSchema = z.object({
	id: z.string(),
	name: z.string(),
	width: z.number(),
	widgets: z.array(WidgetSchema),
});

export type Section = z.infer<typeof SectionSchema>;

const DashboardSchema = z.object({
	id: z.string(),
	name: z.string(),
	sections: z.array(SectionSchema),
	isComingSoon: z.boolean().optional(),
	comingSoonText: z.string().optional(),
});

export type Dashboard = z.infer<typeof DashboardSchema>;

export const DashboardGroupSchema = z.object({
	activeDashboardId: z.string(),
	dashboards: z.array(DashboardSchema),
});

export type DashboardGroup = z.infer<typeof DashboardGroupSchema>;


export function useDashboardLayout() {
	const {
		useStateQuery,
		useStateMutation,
	} = createStateQueries<IDashboardGroup, DashboardGroup>({
		storageKey: '__DASHBOARD_LAYOUT__',
		isSaveChange: false,
		getDefaultState: createDashboardGroup,
		entityId: 'layout-dashboard',
		schema: DashboardGroupSchema,
		hydrateFn: hydrate,
		rehydrateFn: rehydrate,
		urlGet: '',
		urlSet: '',
		saveHistory: true,
	});

	const { data } = useStateQuery();
	const { mutate } = useStateMutation();

	const state = ref<IDashboardGroup>({
		activeDashboardId: '',
		dashboards: [],
	});

	const activeDashboardId = computed(() => state.value.activeDashboardId);

	const tabs = computed<IDashboardTab[]>(() =>
		state.value.dashboards.map(d => ({
			id: d.id,
			name: d.name,
			isComingSoon: d.isComingSoon,
			comingSoonText: d.comingSoonText,
			isActive: d.id === activeDashboardId.value,
		})),
	);

	const sections = computed<ISection[]>(() =>
		state.value.dashboards.find(el => el.id === activeDashboardId.value)?.sections || [],
	);

	watch(data, newState => {
		if (newState) {
			state.value = { ...newState };
		}
	}, { immediate: true });

	watch(state, (newState, oldState) => {
		if (JSON.stringify(newState) === JSON.stringify(oldState)) {
			return;
		}

		mutate(newState);

	}, { deep: true });

	return {
		tabs,
		sections,
	};
}

function hydrate(data: IDashboardGroup): DashboardGroup {
	return {
		activeDashboardId: data.activeDashboardId,
		dashboards: data.dashboards.map((dashboard) => ({
			id: dashboard.id,
			name: dashboard.name,
			sections: dashboard.sections.map((section) => ({
				id: section.id,
				name: section.name,
				width: section.width,
				widgets: section.widgets.map((widget) => ({
					id: widget.id,
					defaultStateType: widget.defaultStateType,
					widgetType: widget.widgetType,
					name: widget.name,
					height: widget.height,
					maxCountRow: widget.maxCountRow,
					displayVariant: widget.displayVariant,
				})),
			})),
			isComingSoon: dashboard.isComingSoon,
			comingSoonText: dashboard.comingSoonText,
		})),
	};
}

function rehydrate(data: DashboardGroup): IDashboardGroup {
	return {
		activeDashboardId: data.activeDashboardId,
		dashboards: data.dashboards.map(d => ({
			id: d.id,
			name: d.name,
			sections: d.sections.map(s => ({
				id: s.id,
				name: s.name,
				width: s.width,
				widgets: s.widgets
					.map(w =>
						rehydrateWidget(
							w.id,
							w.widgetType,
							w.height,
							w.displayVariant,
							w.defaultStateType,
							w.maxCountRow,
						))
					.filter(w => w !== null),
			})),
			isComingSoon: d.isComingSoon,
			comingSoonText: d.comingSoonText,
		})),
	};
}

