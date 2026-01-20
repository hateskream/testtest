<script setup lang="ts">
import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { getLinksQuery } from '../../query/get-links-query.ts';

import WidgetLinks from '../widget-links.vue';
import WidgetLinksSkeleton from '../widget-links-skeleton.vue';
import WidgetLinksError from '../widget-links-error.vue';

const props = defineProps<{
	meta: {
		tickerId: string;
	};
}>();

const { data, isLoading, isError, refetch } = getLinksQuery(() => ({
	ticker_id: props.meta.tickerId,
}));
</script>

<template>
	<chart-common-widget-layout>
		<template #header>
			Links
		</template>

		<template #body>
			<template v-if="isLoading">
				<widget-links-skeleton />
			</template>

			<template v-else-if="data && !isError">
				<widget-links :content="data" />
			</template>

			<template v-else>
				<widget-links-error @retry="refetch" />
			</template>
		</template>
	</chart-common-widget-layout>
</template>

<style scoped>

</style>
