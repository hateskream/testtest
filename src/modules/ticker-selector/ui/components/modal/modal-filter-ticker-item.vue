
<script setup lang="ts">
import { ModalItemCheckbox } from '@/modules/widgets/base';

interface IProps {
	isSelected:boolean;
	ticker?: string | null;
	name?: string | null;
}

defineProps<IProps>();

interface IEmits {
	(e: 'update', data:boolean): void;
}
const emits = defineEmits<IEmits>();
</script>


<template>
	<modal-item-checkbox
		:model-value="isSelected"
		@update:model-value="
			emits('update', !isSelected)
		"
	>
		<div :class="classes.listItemData">
			<slot name="image" />

			<div :class="classes.listItemDataNameWrapper">
				<span :class="classes.listItemDataName">
					{{ ticker }}
				</span>
				<span>·</span>
				<span :class="classes.listItemDataSubName">
					{{ name }}
				</span>
			</div>
		</div>
	</modal-item-checkbox>
</template>


<style module="classes">
.listItemData {
	display: flex;
	align-items: center;
	gap: 12px;
}

.listItemDataName {
	font-style: normal;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-500);
	text-transform: uppercase;
}

.listItemDataSubName {
	font-style: normal;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-300);
	text-transform: capitalize;
}

.listItemDataTitle {
	width: 100%;
	padding: 10px 12px;
}

.listItemDataNameWrapper {
	display: flex;
	align-items: center;
	gap: 6px;
}

</style>
