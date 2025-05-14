<script setup lang="ts">

</script>


<template>
	<div :class="classes.badge">
		<div :class="classes.icon">
			<slot />
		</div>
	</div>

</template>

<style module="classes">
.badge {
	border-radius: 500px;
	background-color: var(--charts-bg-badge);
	cursor: pointer;
	height: 30px;
	width: 30px;
	position: relative;
	overflow: hidden;
}
.icon {
	position:absolute;
	top:50%;
	left:50%;
	transform: translate(-50%, -50%);
	display:flex;
	align-items:center;
	justify-content:center;
}
</style>
