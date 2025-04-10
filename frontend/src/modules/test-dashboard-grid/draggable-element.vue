<script setup lang="ts">
const emit = defineEmits<{
	(e: 'drag'): void;
	(e: 'drag-end'): void;
}>();
</script>

<template>
	<!--
	unselectable="on"
		effect-allowed="move"
	-->
	<div
		class="droppable"
		draggable="true"
		@drag="emit('drag')"
		@dragend="emit('drag-end')"
	>
		Droppable Element (Drag me!)
	</div>
</template>

<style scoped>
.droppable {
	width: 150px;
	margin: 10px 0;
	padding: 10px;
	text-align: center;
	background-color: #ffdddd;
	border: 1px solid #000000;
}
</style>
