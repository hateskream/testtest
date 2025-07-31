<script setup lang="ts">
import { computed } from 'vue';

interface IProps {
	data: string;
}

const props = defineProps<IProps>();

const formattedValue = computed(() => new Date(props.data).toLocaleDateString('ru-RU'));
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
