<script setup lang="ts">
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.leftCol">
			<slot name="leftCol"></slot>
		</div>
		<div :class="classes.mainCol">
			<slot name="mainCol"></slot>
		</div>
		<div :class="classes.rightCol">
			<slot name="rightCol"></slot>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	gap: 24px;
}

.leftCol,
.rightCol {
	flex-grow: 1;
	min-width: 200px;
	overflow:scroll;
}

.mainCol {
	flex-grow: 2;
	overflow:scroll;
}
</style>
