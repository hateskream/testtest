<script setup lang="ts">
import { computed } from 'vue';
import { notNullish } from '@vueuse/core';

import { MetricsRowValueCell } from '@/modules/ticker/ui/base';

interface IMetricsRowRatioCell {
	value?: string | number;
}

const props = defineProps<IMetricsRowRatioCell>();

const preparedValue = computed(() => {
	if (notNullish(props.value)) {
		return `${props.value} x`;
	}

	return undefined;
});
</script>

<template>
	<metrics-row-value-cell :value="preparedValue">
		<template v-if="$slots.tooltip" #tooltip>
			<slot name="tooltip" />
		</template>
	</metrics-row-value-cell>
</template>
