<template>
	<div :class="classes.title">
		<slot />
	</div>
</template>

<style module="classes">
.title {
	padding: 12px;
	font-weight: 300;
	font-size: 13px;
	text-align: left;
	color: var(--text-color-base-300);
	letter-spacing: 0.052px;
}
</style>
