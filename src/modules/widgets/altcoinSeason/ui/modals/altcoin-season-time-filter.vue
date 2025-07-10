<script setup lang="ts">
import { ModalItemNumber, ModalBadgeList } from '@/modules/widgets/base';
</script>

<template>
	<modal-badge-list>
		<template #title>Filter</template>
		<modal-item-number :value="1">1 day</modal-item-number>
		<modal-item-number :value="2">7 days</modal-item-number>
		<modal-item-number :value="3">30 days</modal-item-number>
		<modal-item-number :value="4">90 days</modal-item-number>
		<modal-item-number :value="5">1 year</modal-item-number>
	</modal-badge-list>
</template>

<style module="classes">
</style>
