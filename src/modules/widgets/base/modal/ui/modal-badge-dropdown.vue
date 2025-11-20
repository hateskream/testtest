<script setup lang="ts">
import type { CSSProperties } from 'vue';

import { type IPositionProps, UiPosition } from '@/shared/ui/position';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ModalBadgeTitle } from '@/modules/widgets/base';

interface IProps {
	backgroundColor?: CSSProperties['backgroundColor'];
	color?: CSSProperties['color'];
	strategy?: 'fixed' | 'absolute';
	uiPositionProps?: Omit<IPositionProps, 'strategy'>;
	paddingLeft?: CSSProperties['paddingLeft'];
	displayVariant: 'default' | 'new';
}

const props = defineProps<IProps>();
</script>

<template>
	<ui-position
		ref="position"
		placement="bottom-start"
		v-bind="props.uiPositionProps || {}"
		:strategy="props.strategy"
	>
		<template #title="{isVisible}">
			<modal-badge-title
				:background-color="props.backgroundColor"
				:color="props.color"
				:padding-left="props.paddingLeft"
				:display-variant="props.displayVariant"
				:class="classes.title"
			>
				<slot name="title" :is-visible="isVisible" />

				<ui-icon
					:id="IconIds.DropdownDown"
					:class="[
						classes[props.displayVariant === 'default' ? 'iconOld' : 'iconNew'],
						isVisible && classes.visible,
					]"
				/>
			</modal-badge-title>
		</template>

		<template #content="{isVisible}">
			<slot name="content" :is-visible="isVisible" />
		</template>
	</ui-position>
</template>

<style module="classes">
.iconNew {
	width: 12px;
	height: 12px;
	color: var(--contrast-contrast-60, rgb(255 255 255 / 40%));
	transition: color 0.2s ease;
}

.iconOld {
	width: 16px;
	height: 16px;
	color: var(--color-icon-base-300, #646568);
	transition: color 0.2s ease;
}

.title:hover .iconNew,
.visible {
	color: rgb(255 255 255 / 100%);
}
</style>
