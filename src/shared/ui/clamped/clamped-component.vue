<script setup lang="ts">
interface IUiClampedProps {
	rows?: number;
	as?: string;
}

const props = withDefaults(defineProps<IUiClampedProps>(), {
	rows: 3,
	as: 'div',
});
</script>
<template>
	<component :is="props.as" :class="classes.clamped">
		<slot />
	</component>
</template>
<style module="classes">
.clamped {
	display: -webkit-box;
	overflow: hidden;
	text-overflow: ellipsis;
	-webkit-line-clamp: v-bind(rows);
	line-clamp: v-bind(rows);
	-webkit-box-orient: vertical;
}
</style>
