<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
	data:{
		value:string;
	};
}

const props = defineProps<IProps>();

const formattedValue = computed(() => {
	try {
		return new Date(props.data.value).toLocaleDateString('ru-RU');
	} catch {
		console.log('error date', props.data);
		return '—';
	}
});
</script>

<template>
	<div :class="classes.date" class="paragraph-p-00">{{ formattedValue }}</div>
</template>

<style module="classes">
.date {
	text-align: right;
	color: var(--text-color-base-500);
}
</style>
