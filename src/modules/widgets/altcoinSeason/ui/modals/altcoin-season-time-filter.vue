<script setup lang="ts">
// import { ref } from 'vue';

import { ModalFilter, ModalItemNumber } from '@/modules/widgets/base';
// import { type Period } from '@/modules/widgets/altcoinSeason/model';

// const period = ref<Period>('90D');
</script>

<template>
	<modal-filter>
		<template #title>Filter</template>

		<template #content>
			<modal-item-number :value="1">1 day</modal-item-number>
			<modal-item-number :value="2">7 days</modal-item-number>
			<modal-item-number :value="3">30 days</modal-item-number>
			<modal-item-number :value="4">90 days</modal-item-number>
			<modal-item-number :value="5">1 year</modal-item-number>
		</template>

	</modal-filter>
</template>

<style module="classes">
</style>
