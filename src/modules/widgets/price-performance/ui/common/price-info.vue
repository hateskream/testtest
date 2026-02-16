<script setup lang="ts">
import { computed } from 'vue';

import { getDateFormatter } from '@/shared/lib';

interface IPriceInfoProps {
	isMarketOpen: boolean;
	price: number;
	currencySymbol: string;
	openTime?: string;
	closeTime?: string;
	suffix?: string | undefined;
}

const props = defineProps<IPriceInfoProps>();

const marketStatusLabel = computed(() => props.isMarketOpen ? 'At Close:' : 'At Open:');

function formatDateTimeToLocal(timeString: string) {
	if (!timeString) {
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
	const formatter = getDateFormatter({
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
	});

	return formatter.format(date);
}

const relevantDateTime = computed(() => {
	const time = props.isMarketOpen ? props.closeTime : props.openTime;
	return time ? formatDateTimeToLocal(time) : '';
});
</script>

<template>
	<div :class="classes.priceWrapper">
		<div :class="classes.timestamp" class="text-50-r">
			{{ marketStatusLabel }} {{ relevantDateTime }}
		</div>
		<div :class="classes.performanceWrapper">
			<div :class="classes.price" class="title-300-r">
				<div>{{ props.currencySymbol }}</div>
				<div>{{ props.price.toFixed(2) }}</div>
				<div v-if="props.suffix">/{{props.suffix}}</div>
			</div>
			<slot />
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
