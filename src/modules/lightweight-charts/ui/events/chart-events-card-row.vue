<script setup lang="ts">

interface IProps {
	name: string;
	value: string;
}

const props = defineProps<IProps>();
</script>

<template>
	<div :class="classes.row">
		<div :class="classes.cell">{{ props.name }}</div>
		<div :class="classes.cell">{{ props.value }}</div>
	</div>
</template>

<style module="classes">
.row {
	display: flex;
}

.cell {
	flex: 1 0 0;
}
</style>
