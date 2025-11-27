<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

import ModalFilterRowItem from './modal-filter-row-item.vue';

export interface IModalFilterTickerProps {
	label: string;
	icon: IconIds;
	isSelected: boolean;
}

const props = withDefaults(defineProps<IModalFilterTickerProps>(), {

});

interface IEmits {
	(e: 'update', state: boolean): void;
}

const emit = defineEmits<IEmits>();

const isSelectedModel = computed({
	get: () => props.isSelected,
	set: () => emit('update', !props.isSelected),
});
</script>

<template>
	<modal-filter-row-item
		v-model="isSelectedModel"
		:uppercase-name="false"
	>
		<template #image>
			<div :class="classes.marketIconWrapper">
				<ui-icon
					:id="props.icon"
					width="22px"
					height="22px"
					:class="classes.marketIcon"
				/>
			</div>
		</template>
		<template #name>{{ props.label }}</template>
	</modal-filter-row-item>
</template>

<style module="classes">
.marketIconWrapper {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 30px;
	height: 30px;
	text-align: center;
	background: transparent;
	border: 1px solid var(--border-color-base-300);
	border-radius: 999px;
	backdrop-filter: none;
	isolation: isolate;
}

.marketIcon {
	color: var(--icon-color-base-300);
}
</style>
