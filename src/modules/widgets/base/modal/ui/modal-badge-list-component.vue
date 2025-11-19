<template>
	<div :class="classes.container">
		<div
			v-if="$slots.title"
			:class="classes.title"
		>
			<slot name="title" />
		</div>

		<div :class="classes.scroll">
			<slot />
		</div>
	</div>
</template>

<style module="classes">
.title {
	padding: 18px 18px 10px;
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	color: var(--text-color-base-300);
	text-transform: capitalize;
	letter-spacing: 0.052px;
}

.container {
	box-sizing: border-box;
	width: max-content;
	min-width: 208px;
	height: 100%;
	overflow: hidden;
	background: var(--bg-modal-color-base);
	border: 1px solid var(--border-modal-color-base);
	border-radius: 18px;
}

.scroll {
	max-height: calc(80svh - 46px);
	padding: 6px;
	overflow-y: auto;
	scrollbar-gutter: stable;
}

@supports (-moz-appearance: none) {
	.scroll:not(:hover) {
		scrollbar-width: none;
	}

	.scroll {
		scrollbar-width: unset;
	}
}

.scroll:not(:hover)::-webkit-scrollbar {
	display: none;
}

.scroll:hover::-webkit-scrollbar {
	width: 6px;
}
</style>
