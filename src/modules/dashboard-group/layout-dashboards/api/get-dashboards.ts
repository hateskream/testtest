import { z } from 'zod';

import { useApiClient } from '@/shared/service/api';
import { useLogger } from '@/shared/service/monitoring';
import { createDashboardMetaDefaults, DashboardMetaSchema, rehydrateDashboardMeta } from '../model';
import { delay } from '@/shared/lib';

const IS_USE_MOCK = true;

const DashboardMetaListSchema = z.array(DashboardMetaSchema);

export async function getDashboards() {
	const logger = useLogger();

	try {
		const response = await getDashboardsMeta();
		return response.map(rehydrateDashboardMeta);
	} catch (error) {
		logger.error('Failed to get dashboards', { error: error as Error });
		throw error;
	}
}

function getDashboardsMeta() {
	return IS_USE_MOCK ? getMockData() : fetchDashboards();
}

async function getMockData() {
	await delay(1000);

	const defaults = createDashboardMetaDefaults();

	return DashboardMetaListSchema
		.parse(defaults.map(item => ({
			id: item.id,
			name: item.name,
			isComingSoon: item.isComingSoon,
			comingSoonText: item.comingSoonText,
		})));
}

function fetchDashboards() {
	const client = useApiClient();

	return client.get('/api/v1/dashboards', DashboardMetaListSchema);
}
