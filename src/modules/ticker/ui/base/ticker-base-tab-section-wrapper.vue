<template>
	<div :class="classes.wrapper">
		<slot />
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
}
</style>
