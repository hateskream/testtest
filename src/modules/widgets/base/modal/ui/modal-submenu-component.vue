<script lang="ts" setup>
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type IPositionProps } from '@/shared/ui/position';
import { UiSubposition } from '@/shared/ui/position';

const props = withDefaults(defineProps<IPositionProps>(), {
	teleport: false,
	trigger: 'hover',
	position: 'right-start',
	offset: 6,
});
</script>

<template>
	<ui-subposition
		v-bind="props"
	>
		<template #title="{ isVisible }">
			<div :class="[classes.title, { [classes.titleActive]: isVisible }]">
				<slot name="title" />

				<ui-icon
					:id="IconIds.RcmArrowRight"
					:class="classes.iconArrowRight"
					width="6"
					height="20"
				/>
			</div>
		</template>

		<template #content="{ isVisible }">
			<slot name="content" :is-visible="isVisible" />
		</template>
	</ui-subposition>
</template>

<style module="classes">
.container {
	position: relative;
	z-index: 1;
	min-width: 204px;
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
	cursor: pointer;
	transition: background-color 0.3s ease;
}

.titleActive {
	background-color: var(--bg-color-surface-01-effect);
}
</style>
