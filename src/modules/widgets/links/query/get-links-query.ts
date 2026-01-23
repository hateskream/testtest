import { useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { getLinksTabs } from '../api/get-links-tabs.ts';
import type { ILinksTabsRequest } from '../api/get-links-tabs.ts';

export function getLinksQuery(_query: MaybeRefOrGetter<ILinksTabsRequest>) {
	const query = computed(
		() => toValue(_query),
	);

	return useQuery({
		queryKey: ['links-widget', () => query.value.ticker_id],
		queryFn: () => getLinksTabs(query.value),
	});
}
