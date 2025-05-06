<template>
	<div :class="classes.content">
		<slot />
	</div>
</template>

<style module="classes">
.content {
	width: max-content;
	min-width: 208px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}
</style>
