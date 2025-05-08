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
	const { value, suffix } =
		props.format === 'pretty-with-key'
			? prettyNumberWithKey(props.value)
			: { value: props.value, suffix: '' };
	const prefix = props.isFiat ? '$' : '';

	const numFormat = new Intl.NumberFormat('en', { minimumFractionDigits: 2 });

	return {
		prefix,
		value,
		suffix,
		default: numFormat.format(+props.value),
	};
});
</script>

<template>
	<ui-tooltip :show-in-ms="100">
		<template #default>
			<div :class="classes.number">
				<span :class="classes.prefix">{{ formattedValue.prefix }}</span>
				<span :class="classes.formatted">{{ formattedValue.value }}</span>
				<span :class="classes.suffix">{{ formattedValue.suffix }}</span>
			</div>
		</template>

		<template #content>
			<div :class="classes.number">
				<span>{{ formattedValue.prefix }}</span>
				<span>{{ formattedValue.default }}</span>
			</div>
		</template>
	</ui-tooltip>
</template>

<style module="classes">
.prefix {
	margin-right: 1px;
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-100);
}

.suffix {
	margin-left: 4px;
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-300);
}

.formatted {
	font-style: normal;
	font-weight: 400;
	font-size: 13px;
	color: var(--text-color-base-500);
	letter-spacing: 0.143px;
}

.number {
	display: flex;
	width: 100%;
}
</style>
