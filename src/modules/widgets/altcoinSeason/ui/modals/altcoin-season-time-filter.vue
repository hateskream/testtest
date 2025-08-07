<script setup lang="ts">
import { ModalItemNumber, ModalBadgeList } from '@/modules/widgets/base';
import { useAltcoinSeasonStore } from '@/modules/widgets/altcoinSeason/stores';

const altcoinSeasonStore = useAltcoinSeasonStore();

</script>

<template>
	<modal-badge-list>
		<template #title>Filter</template>
		<modal-item-number :value="2" @click="altcoinSeasonStore.handlePeriodChange('7D')">7 days</modal-item-number>
		<modal-item-number :value="3" @click="altcoinSeasonStore.handlePeriodChange('30D')">30 days</modal-item-number>
		<modal-item-number :value="4" @click="altcoinSeasonStore.handlePeriodChange('90D')">90 days</modal-item-number>
		<modal-item-number :value="5" @click="altcoinSeasonStore.handlePeriodChange('1Y')">1 year</modal-item-number>
	</modal-badge-list>
</template>

<style module="classes">
</style>
