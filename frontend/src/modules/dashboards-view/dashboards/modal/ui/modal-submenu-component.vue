<script lang="ts" setup>
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiPosition } from '@/shared/ui/position';
</script>

<template>
	<ui-position
		trigger="hover"
		position="right-start"
		:position-offset="12"
	>
		<template #default="{ isVisible }">
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

		<template #content>
			<slot name="content" />
		</template>
	</ui-position>
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
	transition: background-color 0.3s ease;
}

.titleActive {
	background-color: var(--bg-color-surface-01-effect);
}
</style>
