<template>
	<div :class="classes.container">
		<slot name="default" />
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 44px;
	padding: 12px;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-500);
	border-radius: 18px;
	transition: background-color 0.3s ease;
}

.container:hover {
	background-color: var(--bg-color-surface-01-effect);
}
</style>
