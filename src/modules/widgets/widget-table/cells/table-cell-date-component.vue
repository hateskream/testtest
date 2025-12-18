<script setup lang="ts">
import { computed } from 'vue';

import { getDateFormatter } from '@/shared/lib';

interface IProps {
	data: {
		value: string;
	};
}

const props = defineProps<IProps>();

const formattedValue = computed(() => {
	try {
		const date = new Date(props.data.value);

		const formatter = getDateFormatter({ locale: 'ru-RU' });

		return formatter.format(date);
	} catch {
		return '—';
	}
});
</script>

<template>
	<div :class="classes.date" class="text-300-r">{{ formattedValue }}</div>
</template>

<style module="classes">
.date {
	text-align: right;
	color: var(--text-color-base-500);
}
</style>
