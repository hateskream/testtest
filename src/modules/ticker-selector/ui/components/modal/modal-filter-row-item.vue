<script setup lang="ts">
import { ModalItemCheckbox } from '@/modules/widgets/base';
import { UiText } from '@/shared/ui/text';

interface IModalFilterRowItemProps {
	uppercaseName?: boolean;
}

const props = withDefaults(defineProps<IModalFilterRowItemProps>(), {
	uppercaseName: true,
});

const modelValue = defineModel<boolean>({ default: false });
</script>

<template>
	<modal-item-checkbox v-model="modelValue">
		<div :class="classes.wrapper">
			<slot name="image" />
			<div :class="classes.row">
				<ui-text :class="[classes.name, { [classes.uppercase]: props.uppercaseName }]" token="text-300-r">
					<slot name="name" />
				</ui-text>
				<template v-if="$slots.label">
					<span>·</span>
					<ui-text :class="classes.label" token="text-300-r">
						<slot name="label" />
					</ui-text>
				</template>
			</div>
		</div>
	</modal-item-checkbox>
</template>


<style module="classes">
.wrapper {
	display: flex;
	align-items: center;
	gap: 12px;
}

.row {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
}

.name {
	color: var(--text-color-base-500);
}

.name.uppercase {
	text-transform: uppercase;
}

.label {
	color: var(--text-color-base-300);
	text-transform: capitalize;
}
</style>
