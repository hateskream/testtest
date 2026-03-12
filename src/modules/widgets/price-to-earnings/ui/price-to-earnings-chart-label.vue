<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
import type { PriceToEarningsItem } from '../model';

const props = defineProps<{
	item: PriceToEarningsItem;
}>();
</script>

<template>
	<div :class="classes.row">
		<ui-text token="text-200-r" :class="classes.name">
			{{ props.item.label }}
		</ui-text>

		<ui-text token="text-200-r" :class="classes.value">
			{{ props.item.value }}
		</ui-text>
	</div>
</template>

<style module="classes">
.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
}

.name {
	width: 43px;
	text-align: left;
}

.value {
	width: 43px;
	text-align: right;
}
</style>
