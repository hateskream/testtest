<template>
	<div :class="classes.root">
		<slot />
	</div>
</template>

<style module="classes">
.root {
	position: sticky;
	top: 0;
	min-height: 72px;
	padding-top: 16px;

	/* eslint-disable-next-line prettier/prettier */
	/* stylelint-disable-next-line declaration-colon-newline-after */
	background: linear-gradient(
		to top,
		transparent 0,
		var(--bg-color-surface-00) 100%
	);
}
</style>
