<template>
	<div :class="classes.submenu">
		<div :class="classes.content">
			<slot name="content" />
		</div>
	</div>
</template>

<style module="classes">
.submenu {
	min-width: 204px;
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}
</style>
