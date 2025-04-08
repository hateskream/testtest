<script setup lang="ts">
import { computed } from 'vue';

import { prettyNumberWithKey } from '@/shared/lib';
import { UiTooltip } from '@/shared/ui/tooltip';

interface IProps {
	value: string;
	format?: 'pretty-with-key' | 'default';
	isFiat?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
	isFiat: false,
	format: 'default',
});

const formattedValue = computed(() => {
	const val = props.format === 'pretty-with-key' ? prettyNumberWithKey(props.value) : props.value;
	const prefix = props.isFiat ? '$' : '';

	const numFormat = new Intl.NumberFormat('en', { minimumFractionDigits: 2 });

	return {
		value: `${prefix}${val}`,
		default: `${prefix}${numFormat.format(+props.value)}`,
	};
});
</script>

<template>
	<ui-tooltip :show-in-ms="100">
		<template #default>
			<div :class="classes.number">
				<span>{{ formattedValue.value }}</span>
			</div>
		</template>

		<template #content>
			<div :class="classes.number">
				<span>{{ formattedValue.default }}</span>
			</div>
		</template>
	</ui-tooltip>
</template>

<style module="classes">
.number {
	display: flex;
	justify-content: flex-end;
	width: 100%;
}
</style>
