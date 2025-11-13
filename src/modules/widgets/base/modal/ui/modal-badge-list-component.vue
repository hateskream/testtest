<template>
	<div :class="classes.container">
		<div
			v-if="$slots.title"
			:class="classes.title"
		>
			<slot name="title" />
		</div>

		<div>
			<slot />
		</div>
	</div>
</template>

<style module="classes">
.title {
	padding: 12px 12px 10px;
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	text-transform: capitalize;
	letter-spacing: 0.052px;
}

.container {
	width: max-content;
	min-width: 208px;
	max-height: 80svh;
	padding: 6px;
	overflow-y: auto;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
	scrollbar-gutter: stable;
}

@supports (-moz-appearance: none) {
	.container:not(:hover) {
		scrollbar-width: none;
	}

	.container {
		scrollbar-width: unset;
	}
}

.container:not(:hover)::-webkit-scrollbar {
	display: none;
}

.container:hover::-webkit-scrollbar {
	width: 6px;
}
</style>
