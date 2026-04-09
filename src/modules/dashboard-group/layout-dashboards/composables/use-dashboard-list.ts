import { computed, watch } from 'vue';
import { notNullish, useLocalStorage } from '@vueuse/core';

import { useQueryDashboards } from '../queries';

const ACTIVE_DASHBOARD_KEY = '__ACTIVE_DASHBOARD_ID__';

export function useDashboardList() {
	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryDashboards();

	const storedDashboardId = useLocalStorage(ACTIVE_DASHBOARD_KEY, '');
	const activeDashboardId = computed({
		get: () => storedDashboardId.value.length ? storedDashboardId.value : null,
		set: value => storedDashboardId.value = notNullish(value) ? value : '',
	});

	watch(data, dashboards => {
		if (dashboards && dashboards.length > 0) {
			if (!activeDashboardId.value || !dashboards.some(d => d.id === activeDashboardId.value)) {
				activeDashboardId.value = dashboards[0].id;
			}
		}
	}, { immediate: true });

	const tabs = computed(() => {
		if (!data.value) {
			return [];
		}

		return data.value.map(m => ({
			id: m.id,
			name: m.name,
			isComingSoon: m.isComingSoon,
			comingSoonText: m.comingSoonText,
			isActive: m.id === activeDashboardId.value,
		}));
	});

	function changeActiveDashboard(id: string) {
		activeDashboardId.value = id;
	}

	return {
		tabs,
		activeDashboardId,
		isLoading,
		isError,
		refetch,
		changeActiveDashboard,
	};
}
