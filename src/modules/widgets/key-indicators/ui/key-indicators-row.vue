<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import type { IKeyIndicator } from '../model/contract';
import { UiIcon, IconIds } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';

const props = defineProps<{
	indicator: IKeyIndicator;
}>();

const classes = useCssModule('classes');

const icon = computed(() => {
	if (props.indicator.status === 'positive') {
		return {
			id: IconIds.Gainers,
			class: classes.positive,
		};
	}

	if (props.indicator.status === 'negative') {
		return {
			id: IconIds.Loosers,
			class: classes.negative,
		};
	}

	return null;
});
</script>

<template>
	<div :class="classes.root">
		<ui-icon
			v-if="icon"
			:id="icon.id"
			:class="icon.class"
			width="8px"
			height="8px"
		/>

		<ui-clamped :rows="1">
			<ui-text token="text-200-r" :class="classes.text">
				{{ indicator.label }}
			</ui-text>
		</ui-clamped>
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
	color: #ffffff;
}

.negative {
	color: var(--atom-warning-00, #fc1d4d);
}

.positive {
	color: var(--atom-success-00, #04eda0);
}
</style>
