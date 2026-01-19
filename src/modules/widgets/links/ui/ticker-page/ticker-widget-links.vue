<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';

import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { getLinksTabs } from '@/modules/widgets/links/api/get-links-tabs.ts';

import WidgetLinkItem from '@/modules/widgets/links/ui/widget-link-item.vue';

const props = defineProps<{
	meta: {
		tickerId: string;
	};
}>();

const { data } = useQuery({
	queryKey: ['ticker-widget', 'tabs'],
	queryFn: () => getLinksTabs({ ticker_id: props.meta.tickerId }),
});
</script>

<template>
	<chart-common-widget-layout>
		<template #header>
			Links
		</template>

		<template #body>
			<widget-link-item :content="data" />
		</template>
	</chart-common-widget-layout>
</template>

<style scoped>

</style>
