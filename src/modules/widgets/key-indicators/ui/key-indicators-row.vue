<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import type { IKeyIndicator } from '../model/contract';
import { UiIcon, IconIds } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';

const props = defineProps<{
	indicator: IKeyIndicator;
}>();

const classes = useCssModule('classes');

const icon = computed(() => {
	if (props.indicator.status === 'positive') {
		return {
			id: IconIds.PositiveKeyIndicator,
			class: classes.positive,
		};
	}

	return {
		id: IconIds.NegativeKeyIndicator,
		class: classes.negative,
	};
});
</script>

<template>
	<div :class="classes.root">
		<ui-icon
			:id="icon.id"
			:class="icon.class"
			width="8px"
			height="8px"
		/>

		<ui-text token="text-200-r" :class="classes.text">
			{{ indicator.label }}
		</ui-text>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	align-items: center;
	gap: 4px;
	height: 22px;
}

.text {
	display: -webkit-box;
	flex: 1 0 0;
	overflow: hidden;
	color: #ffffff;
	text-overflow: ellipsis;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 1;
}

.negative {
	color: var(--text-color-negative-500);
}

.positive {
	color: var(--text-color-positive-500);
}
</style>
