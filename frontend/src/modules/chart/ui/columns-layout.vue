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
.root{
	display:flex;
	gap:24px;
}

.leftCol, .rightCol{
	min-width:200px;
	flex-grow:1;
}
.mainCol{
	flex-grow:2;
}
</style>
