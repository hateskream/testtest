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
	padding-inline: 12px;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-500);
	border-radius: 20px;
	transition: background-color 0.3s ease;
}

.container:hover {
	background-color: rgb(45 45 47 / 40%);
}
</style>
