<script lang="ts" setup>
import { computed, ref, useCssModule } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

const isVisibleSubmenu = ref(false);

const classes = useCssModule('classes');

const classList = computed(() => ({
	[classes.title]: true,
	[classes.titleActive]: isVisibleSubmenu.value,
}));
</script>

<template>
	<div
		:class="classes.container"
		@mouseleave="isVisibleSubmenu = false"
	>
		<div
			:class="classList"
			@mouseenter="isVisibleSubmenu = true"
		>
			<slot name="title" />

			<ui-icon
				:id="IconIds.RcmArrowRight"
				:class="classes.iconArrowRight"
				width="6"
				height="20"
			/>
		</div>

		<div
			v-show="isVisibleSubmenu"
			:class="classes.content"
		>
			<slot name="content" />
		</div>
	</div>
</template>

<style module="classes">
.container {
	position: relative;
	z-index: 1;
	min-width: 204px;
}

.content::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 100%;
	z-index: -1;
	width: 500px;
	height: 500px;
	transform: translate(0, -50%);
}

.iconArrowRight {
	color: #7a7a7a;
}

.title {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 12px;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-500);
	border-radius: 18px;
	transition: background-color 0.3s ease;
}

.titleActive {
	background-color: var(--bg-color-surface-01-effect);
}
</style>
