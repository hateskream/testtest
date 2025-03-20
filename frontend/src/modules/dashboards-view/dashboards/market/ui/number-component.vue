<script setup lang="ts">
import { computed } from 'vue';

import { prettyNumberWithKey } from '../utils';

interface IProps {
	value: string;
	format?: 'pretty-with-key' | 'default';
	isFiat?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
	isFiat: false,
	format: 'default',
});

const formattedValue = computed(() => ({
	fiat: props.isFiat ? '$' : '',
	value: props.format === 'pretty-with-key' ? prettyNumberWithKey(props.value) : props.value,
	digits: props.value,
}));
</script>

<template>
	<div :class="classes.number">
		<span v-if="isFiat">{{ formattedValue.fiat }}</span>
		<span>{{ formattedValue.value }}</span>
	</div>
</template>

<style module="classes">
.number {
	display: flex;
}
</style>
