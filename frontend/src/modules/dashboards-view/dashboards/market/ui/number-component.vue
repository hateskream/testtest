<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
	value: string;
	isFiat?: boolean;
}

const props = withDefaults(defineProps<IProps>(), {
	isFiat: false,
});

const formattedValue = computed(() => ({
	fiat: props.isFiat ? '$' : '',
	value: props.value,
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
