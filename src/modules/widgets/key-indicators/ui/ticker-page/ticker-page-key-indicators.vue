<script setup lang="ts">
import { useQueryKeyIndicators } from '../../query/use-query-key-indicators';

import KeyIndicatorsLoading from '../key-indicators-loading.vue';

const props = defineProps<{
	meta: {
		tickerId: string;
	};
}>();

const { data, isLoading, isError } = useQueryKeyIndicators(() => ({
	ticker_id: props.meta.tickerId,
}));
</script>

<template>
	<template v-if="isLoading">
		<key-indicators-loading />
	</template>

	<template v-if="data && !isError">
		{{ data }}
	</template>

	<template v-else>

	</template>
</template>

<style module="classes">

</style>
