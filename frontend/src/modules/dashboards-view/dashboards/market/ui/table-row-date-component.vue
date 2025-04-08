<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	value: string;
}>();

const formattedValue = computed(() => new Date(props.value).toLocaleDateString('ru-RU'));
</script>

<template>
	<div :class="classes.date">{{ formattedValue }}</div>
</template>

<style module="classes">
.date {
	display: flex;
	justify-content: flex-end;
	width: 100%;
}
</style>
