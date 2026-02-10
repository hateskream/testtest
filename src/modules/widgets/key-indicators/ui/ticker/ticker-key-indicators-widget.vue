<script setup lang="ts">
import { useQueryKeyIndicators } from '../../query/use-query-key-indicators';
import type { ITickerWidgetMeta } from '@/modules/ticker';

import KeyIndicatorsLoading from '../key-indicators-loading.vue';
import KeyIndicatorsError from '../key-indicators-error.vue';
import KeyIndicatorsWrapper from '../key-indicators-wrapper.vue';
import KeyIndicatorRow from '../key-indicators-row.vue';

const props = defineProps<{
	meta: ITickerWidgetMeta;
}>();

const { data, isLoading, isError } = useQueryKeyIndicators(() => ({
	ticker_id: props.meta.tickerId,
}));
</script>

<template>
	<template v-if="isLoading">
		<key-indicators-loading />
	</template>

	<template v-else-if="data && !isError">
		<key-indicators-wrapper>
			<template #indicators>
				<key-indicator-row
					v-for="(item, index) in data.indicators"
					:key="index"
					:indicator="item"
				/>
			</template>

			<template #summarized>
				{{data.summarized}}
			</template>
		</key-indicators-wrapper>
	</template>

	<template v-else>
		<key-indicators-error />
	</template>
</template>

<style module="classes">

</style>
