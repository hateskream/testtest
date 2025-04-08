<template>
	<div :class="classes.container">
		<div :class="classes.title">
			<slot name="title" />
		</div>

		<div :class="classes.content">
			<slot name="content" />
		</div>
	</div>
</template>

<style module="classes">
.container {
	padding: 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 8px;
}

.title {
	padding: 12px;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
}
</style>
