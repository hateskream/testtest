<script setup lang="ts">
import { BaseTickerWidgetContent, BaseTickerWidgetHeader, BaseTickerWidgetWrapper } from '@/modules/widgets/base';
import { getLinksQuery } from '../../query/get-links-query.ts';
import type { ITickerWidgetMeta } from '@/modules/ticker';

import WidgetLinks from '../widget-links.vue';
import WidgetLinksSkeleton from '../widget-links-skeleton.vue';
import WidgetLinksError from '../widget-links-error.vue';

const props = defineProps<{
	meta: ITickerWidgetMeta;
}>();

const { data, isLoading, isError, refetch } = getLinksQuery(() => ({
	ticker_id: props.meta.tickerId,
}));
</script>

<template>
	<base-ticker-widget-wrapper>
		<base-ticker-widget-header>
			{{ props.meta.name }}
		</base-ticker-widget-header>

		<base-ticker-widget-content>
			<template v-if="isLoading">
				<widget-links-skeleton />
			</template>

			<template v-else-if="data && !isError">
				<widget-links :content="data" />
			</template>

			<template v-else>
				<widget-links-error @retry="refetch" />
			</template>
		</base-ticker-widget-content>
	</base-ticker-widget-wrapper>
</template>

<style scoped>

</style>
