<template>
	<div :class="classes.title">
		<slot />
	</div>
</template>

<style module="classes">
.title {
	display: flex;
	align-items: center;
	width: max-content;
	height: 32px;
	padding: 7.5px 12px;
	font-weight: 300;
	font-size: 10px;
	text-align: left;
	color: var(--text-color-base-300);
	background-color: var(--bg-color-base-300);
	border-radius: 18px;
	cursor: pointer;
	gap: 4px;
}
</style>
