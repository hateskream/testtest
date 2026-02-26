<template>
	<div :class="classes.body">
		<slot />
	</div>
</template>

<style module="classes">
.body {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding: var(--padding-padding-s5, 8px) var(--padding-padding-s11, 20px);
	gap: var(--padding-padding-s5, 8px);
}
</style>
