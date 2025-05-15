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
	position: relative;
	width: 30px;
	height: 30px;
	overflow: hidden;
	background-color: var(--charts-bg-badge);
	border-radius: 500px;
	cursor: pointer;
}

.icon {
	position: absolute;
	top: 50%;
	left: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	transform: translate(-50%, -50%);
}
</style>
