<script setup lang="ts">
import { ModalBadgeList, ModalItemNumber } from '@/modules/widgets/base';
import type { Period } from '@/modules/widgets/altcoinSeason/model';

const selectedPeriod = defineModel<Period>('period', { required: true });

function handlePeriodChange(period: Period) {
	selectedPeriod.value = period;
}
</script>

<template>
	<modal-badge-list>
		<template #title>Filter</template>
		<modal-item-number :value="2" @click="handlePeriodChange('7D')">7 days</modal-item-number>
		<modal-item-number :value="3" @click="handlePeriodChange('30D')">30 days</modal-item-number>
		<modal-item-number :value="4" @click="handlePeriodChange('90D')">90 days</modal-item-number>
		<modal-item-number :value="5" @click="handlePeriodChange('1Y')">1 year</modal-item-number>
	</modal-badge-list>
</template>

<style module="classes">
</style>
