import { computed, ref, watch } from 'vue';
import { z } from 'zod';

import {
	type IDashboardGroup,
	type IDashboardTab,
	type ISection,
	createDashboardGroup,
	rehydrateWidget,
} from '../model';
import { createStateQueries } from '@/shared/service/data-repo';

const WidgetPresetSchema = z.object({
	widgetType: z.string(),
	name: z.string(),
});

export type WidgetPreset = z.infer<typeof WidgetPresetSchema>;

const WidgetSchema = WidgetPresetSchema.extend({
	id: z.string(),
	defaultStateType: z.string(),
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
		isSaveChange: true,
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
				})),
			})),
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
					.map(w => rehydrateWidget(w.id, w.widgetType, w.defaultStateType))
					.filter(w => w !== null),
			})),
		})),
	};
}

