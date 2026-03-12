<script setup lang="ts">
import { computed } from 'vue';

import { UiText } from '@/shared/ui/text';
import type { AnnualReturnsItem } from '../model';

const props = defineProps<{
	item: AnnualReturnsItem;
}>();

const valueDisplay = computed(() => {
	const isNegative = props.item.value < 0;

	if (isNegative) {
		return `−${Math.abs(props.item.value)}%`;
	}

	return `+${props.item.value}%`;
});
</script>

<template>
	<div :class="[classes.label, classes[props.item.status]]">
		<ui-text token="text-200-r" :class="classes.text">
			{{props.item.label}}
		</ui-text>

		<ui-text token="text-200-r" :class="classes.value">
			{{valueDisplay}}
		</ui-text>
	</div>
</template>

<style module="classes">
.label {
	display: flex;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
}
</style>
