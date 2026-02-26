<script setup lang="ts">
import { ModalItemCheckbox } from '@/modules/widgets/base';
import { UiText } from '@/shared/ui/text';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiTooltipBase } from '@/shared/ui/tooltip-base';

interface IChartIndicatorsListItemProps {
	label: string;
	title: string;
	disabled?: boolean;
}

const props = defineProps<IChartIndicatorsListItemProps>();

const modelValue = defineModel<boolean>({ default: false });
</script>

<template>
	<modal-item-checkbox v-model="modelValue" :disabled="props.disabled">
		<div :class="classes.indicatorName">
			<ui-text token="text-300-r">
				{{ props.label }}
			</ui-text>
			<ui-text :class="classes.indicatorTitle" token="text-200-r">
				{{ props.title }}
			</ui-text>
		</div>
		<ui-tooltip-base
			v-if="props.disabled"
			:label="`Insufficient data for ${props.label}`"
			:class="classes.info"
			text="Select a wider date range to enable this indicator"
			placement="right"
		>
			<template #trigger>
				<ui-icon
					:id="IconIds.InfoRectangle"
					width="12px"
					height="12px"
				/>
			</template>
		</ui-tooltip-base>
	</modal-item-checkbox>
</template>

<style module="classes">
.indicatorName {
	display: flex;
	align-items: flex-end;
	gap: 5px;
}

.indicatorTitle {
	color: var(--text-color-base-300);
}

.info {
	margin-left: 5px;
}
</style>
