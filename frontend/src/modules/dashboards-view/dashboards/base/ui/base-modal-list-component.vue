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
	position: absolute;
	top: 0;
	left: 100%;
	width: max-content;
	min-width: 208px;
	padding: 0 6px;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}

.title {
	padding: 12px 0;
	font-weight: 300;
	font-size: 13px;
	text-align: left;
	color: var(--text-color-base-300);
}
</style>
