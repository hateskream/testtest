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
	height: 40px;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-500);
	border-radius: 20px;
	cursor: pointer;
	transition: background-color 0.3s ease;
	padding-inline: 12px;
}

.container:hover {
	background-color: var(--bg-color-surface-01-effect);
}
</style>
