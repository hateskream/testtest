<script setup lang="ts">

</script>

<template>
	<div :class="classes.root">
		<div :class="classes.header">Title</div>
		<div :class="classes.content">
			<span :class="classes.placeholder">Coming Soon...</span>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	background: rgb(20 20 21 / 92%);
	border: 1px solid  #1d1d1e;
	border-radius: 18px;
}

.header {
	padding: 8px 8px 6px 10px;
}

.content {
	display: flex;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	padding: 4px 16px 16px;
}
</style>
