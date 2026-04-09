import { useMutation, useQuery } from '@tanstack/vue-query';
import { computed, nextTick, onBeforeUnmount, onScopeDispose, ref, watch } from 'vue';

import {
	changeHeight,
	changeMaxCountRow,
	changeOrderWidgets,
	changeWidth,
	type Dashboard,
	DashboardSchema,
	getDefaultDashboardState,
	hydrateDashboard,
	type IDashboard,
	type ISection,
	type IWidget,
	rehydrateDashboard,
	type WidgetState,
} from '../model';
import { updateById } from '@/shared/lib';
import { queryClient } from '@/shared/service/query-client';
import { LocalRepository } from '@/shared/service/data-repo/local-repository';
import { useHistoryManager } from '@/shared/service/data-repo/use-history.ts';
import { deepCompare } from '@/shared/lib/compare.ts';
import { DashboardRemoteRepository } from '../repositories';

const DASHBOARD_STORAGE_KEY = '__DASHBOARD__';

// TODO: заменить на реальную проверку авторизации
const isAuth = false;

function useBaseRepository(dashboardId: string) {
	if (isAuth) {
		return DashboardRemoteRepository.create({
			entityId: dashboardId,
			schema: DashboardSchema,
			hydrateFn: hydrateDashboard,
			rehydrateFn: rehydrateDashboard,
			urlGet: `/api/v1/dashboards/${dashboardId}`,
			urlSet: `/api/v1/dashboards/${dashboardId}`,
		});
	}

	return LocalRepository.create({
		storageKey: DASHBOARD_STORAGE_KEY,
		isSaveChange: true,
		getDefaultState: () => getDefaultDashboardState(dashboardId),
		entityId: dashboardId,
		schema: DashboardSchema,
		hydrateFn: hydrateDashboard,
		rehydrateFn: rehydrateDashboard,
	});
}

function disposeBaseRepository(dashboardId: string) {
	if (isAuth) {
		DashboardRemoteRepository.dispose(dashboardId);
	} else {
		LocalRepository.dispose(dashboardId);
	}
}

export function useDashboard(dashboardId: string) {
	const STATE_QUERY_KEY = generateQueryDashboardKey(dashboardId);
	const repository = useBaseRepository(dashboardId);

	onScopeDispose(() => {
		disposeBaseRepository(dashboardId);
	});

	const {
		pushToHistory,
		undoStack,
		undo,
		redo,
	} = useHistoryManager({
		key: STATE_QUERY_KEY,
		repository: (data) => repository.set(data as IDashboard),
		maxHistory: 20,
	});

	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQuery<IDashboard>({
		queryKey: STATE_QUERY_KEY,
		queryFn: () => repository.get(),
		refetchOnMount: false,
	});

	const { mutate } = useMutation<Dashboard, Error, IDashboard, { previousState?: IDashboard }>({
		mutationFn: (state) => repository.set(state),
		onMutate: async (newState) => {
			await queryClient.cancelQueries({ queryKey: STATE_QUERY_KEY });

			const previousState = queryClient.getQueryData<IDashboard>(STATE_QUERY_KEY);

			if (previousState) {
				pushToHistory(previousState);
			}

			queryClient.setQueryData(STATE_QUERY_KEY, newState);

			return { previousState };
		},
		onError: (_error, _, context) => {
			if (context?.previousState) {
				queryClient.setQueryData(STATE_QUERY_KEY, context.previousState);
				undoStack.value.pop();
			}
		},
	});

	onBeforeUnmount(() => {
		queryClient.removeQueries({ queryKey: STATE_QUERY_KEY });
	});

	const dashboard = ref<IDashboard>();

	let isUpdatingFromQuery = false;

	watch(data, newState => {
		if (newState) {
			isUpdatingFromQuery = true;

			dashboard.value = { ...newState };

			void nextTick(() => {
				isUpdatingFromQuery = false;
			});
		}
	}, { immediate: true });

	watch(dashboard, (value) => {
		if (!value || isUpdatingFromQuery) {
			return;
		}

		if (deepCompare(value, data.value)) {
			return;
		}

		mutate(value);
	}, { deep: true });

	const sections = computed({
		get: () => dashboard?.value?.sections ?? [],
		set(value) {
			if (dashboard.value) {
				dashboard.value.sections = value;
			}
		},
	});

	function changeWidthSection(sectionId: string, width: number): void {
		sections.value = updateById(
			sections.value,
			sectionId,
			(s) => changeWidth(s, width),
		);
	}

	function changeHeightWidget(sectionId: string, widgetId: string, height: number): void {
		sections.value = updateById(
			sections.value,
			sectionId,
			(s) => ({
				...s,
				widgets: updateById(
					s.widgets,
					widgetId,
					(w) => changeHeight(w, height),
				),
			}),
		);
	}

	function changeMaxCountRowWidget(sectionId: string, widgetId: string, height: number): void {
		sections.value = updateById(
			sections.value,
			sectionId,
			(s) => ({
				...s,
				widgets: updateById(
					s.widgets,
					widgetId,
					(w) => changeMaxCountRow(w, height),
				),
			}),
		);
	}

	function changeOrderWidgetsInSection(sectionId: string, widgets: IWidget[], sectionHeight: number): void {
		sections.value = updateById(
			sections.value,
			sectionId,
			s => changeOrderWidgets(s, widgets, sectionHeight),
		);
	}

	function changeOrderSections(s: ISection[]): void {
		sections.value = s;
	}

	function setWidgetStateType(
		widgetId: string,
		stateType: string,
	): void {
		sections.value = sections.value.map(
			section => ({
				...section,
				widgets: section.widgets
					.map(widget => widget.id === widgetId ? { ...widget, stateType } : widget),
			}),
		);
	}

	function updateWidgetState(widgetId: string, widgetState: WidgetState): void {
		sections.value = sections.value.map(
			section => ({
				...section,
				widgets: section.widgets.map(
					widget => widget.id === widgetId
						? { ...widget, state: widgetState }
						: widget,
				),
			}),
		);
	}

	return {
		isLoading,
		isError,
		refetch,
		sections,
		setWidgetStateType,
		changeWidthSection,
		changeHeightWidget,
		changeMaxCountRowWidget,
		changeOrderWidgetsInSection,
		changeOrderSections,
		updateWidgetState,
		undo,
		redo,
	};
}

function generateQueryDashboardKey(dashboardId: string) {
	return [`state-${DASHBOARD_STORAGE_KEY}`, dashboardId];
}
