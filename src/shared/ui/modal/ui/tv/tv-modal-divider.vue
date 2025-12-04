<template>
	<div :class="classes.driver" />
</template>

<style module="classes">
.driver {
	width: 100%;
	height: 1px;
	background:
		linear-gradient(
			90deg,
			rgb(255 255 255 / 0%) 0%,
			var(--color-border-base-300, rgb(97 97 97 / 30%)) 50%,
			rgb(255 255 255 / 0%) 100%
		);
}
</style>
