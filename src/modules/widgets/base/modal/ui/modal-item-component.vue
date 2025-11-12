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
	font-style: normal;
	font-weight: 300;
	font-size: var(--typography-menu-menu-item, 12px);
	line-height: 150%;
	color: var(--color-text-base-500, #ffffff);
	border-radius: 20px;
	cursor: pointer;
	transition: background-color 0.3s ease;
	padding-inline: 12px;
}

.container:hover {
	background-color: var(--bg-color-surface-01-effect);
}
</style>
