<script setup lang="ts">
import { ModalItemCheckbox } from '@/modules/widgets/base';

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
				<span :class="[classes.name, { [classes.uppercase]: props.uppercaseName }]">
					<slot name="name" />
				</span>
				<template v-if="$slots.label">
					<span>·</span>
					<span :class="classes.label">
						<slot name="label" />
					</span>
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
	font-style: normal;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-500);
}

.name.uppercase {
	text-transform: uppercase;
}

.label {
	font-style: normal;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-300);
	text-transform: capitalize;
}
</style>
