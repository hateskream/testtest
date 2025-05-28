<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import { useChartStore } from '@/modules/chart/store';
const { activeExchange, isActiveMarketOpen } = storeToRefs(useChartStore());


const marketStatusLabel = computed(() => isActiveMarketOpen.value ? 'At Close:' : 'At Open:');


function formatDateTimeToLocal(timeString: string) {
	if (!timeString || !activeExchange.value) {
		return '';
	}

	const today = new Date();

	const [hours, minutes, seconds] = timeString.split(':').map(Number);


	const date = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
		hours,
		minutes,
		seconds,
	);

	return date.toLocaleString([], {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});
}

const relevantDateTime = computed(() => {
	if (!activeExchange.value) {
		return '';
	}

	const timeKey = isActiveMarketOpen.value ? 'closeTime' : 'openTime';
	const time = activeExchange.value[timeKey];

	return time ? formatDateTimeToLocal(time) : '';
});
</script>

<template>
	<div v-if="activeExchange" :class="classes.priceWrapper">
		<div :class="classes.timestamp" class="paragraph-p-03">
			{{ marketStatusLabel }} {{ relevantDateTime }}
		</div>
		<div :class="classes.performanceWrapper">
			<div :class="classes.price" class="header-h02">
				<div>{{ activeExchange.currency_symbol }}</div>
				<div>{{ activeExchange.price.toFixed(2) }}</div>
			</div>
		</div>

	</div>
</template>

<style module="classes">
.priceWrapper {
	display: flex;
	flex-direction: column;
	gap: 1px;
}

.performanceWrapper {
	display: flex;
	gap: 6px;
	align-items: center;
}

.timestamp {
	display: flex;
	align-items: center;
	height: 30px;
	color: var(--text-color-base-300);
}

.price {
	display: flex;
	gap: 2px;
	line-height: 30px;
}
</style>
