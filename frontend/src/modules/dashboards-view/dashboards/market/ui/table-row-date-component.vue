<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
	value: string;
}>();

const formattedValue = computed(() => new Date(props.value).toLocaleDateString('ru-RU'));
</script>

<template>
	<div>{{ formattedValue }}</div>
</template>
