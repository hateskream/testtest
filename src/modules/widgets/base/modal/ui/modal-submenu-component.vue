<script lang="ts" setup>
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { type IPositionProps, UiSubposition } from '@/shared/ui/position';
import { UiModalItem } from '@/shared/ui/modal-items';

const props = withDefaults(defineProps<IPositionProps>(), {
	teleport: false,
	trigger: 'hover',
	position: 'right-start',
	offset: 6,
});
</script>

<template>
	<ui-subposition v-bind="props">
		<template #title>
			<ui-modal-item :class="classes.item">
				<slot name="title" />

				<div :class="classes.wrapper">
					<ui-icon
						:id="IconIds.RcmArrowRight"
						:class="classes.iconArrowRight"
						width="12px"
						height="12px"
					/>
				</div>
			</ui-modal-item>
		</template>

		<template #content>
			<slot name="content" />
		</template>
	</ui-subposition>
</template>

<style module="classes">
.container {
	position: relative;
	z-index: 1;
	min-width: 204px;
}

.item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}

.wrapper {
	display: grid;
	width: 24px;
	height: 24px;
	transform: translateX(0.5px);
	place-items: center;
}

.iconArrowRight {
	color: #7a7a7a;
}
</style>
