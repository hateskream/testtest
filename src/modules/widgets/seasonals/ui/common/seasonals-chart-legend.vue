<script setup lang="ts">
import { getDateFormatter } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';

const formatter = getDateFormatter({ month: 'short' });

const months = Array.from({ length: 6 }).map((_, key) => {
	const date = new Date();
	date.setMonth(key * 2);

	return {
		id: key * 2,
		name: formatter.format(date),
	};
});
</script>

<template>
	<div :class="classes.legend">
		<div
			v-for="month in months"
			:key="month.id"
			:class="classes.legendItem"
		>
			<ui-text token="text-50-r" align="center">
				{{ month.name }}
			</ui-text>
		</div>
	</div>
</template>

<style module="classes">
.legend {
	display: flex;
	flex-shrink: 0;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	height: var(--height-s16, 40px);
	padding-right: var(--padding-s14, 32px);
}

.legendItem {
	display: flex;
	flex: 1 0 0;
	justify-content: center;
	align-items: center;
	align-self: stretch;
	color: var(--text-300, rgb(255 255 255 / 62%));
}
</style>
