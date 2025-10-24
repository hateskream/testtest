<script setup lang="ts">
import { ref } from 'vue';
import { useVModel } from '@vueuse/core';

import { UiPosition } from '@/shared/ui/position';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { ChartCommonDropdownLayout } from '@/modules/chart/components/shared';


interface IPeriodSelectProps {
	periods: string[];
	modelValue: string | undefined;
}

const props = defineProps<IPeriodSelectProps>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

const selectedPeriod = useVModel(props, 'modelValue', emit);


const positionRef = ref<InstanceType<typeof UiPosition> | null>(null);
const handlePeriodSelect = (period: string) => {
	if (positionRef.value) {
		positionRef.value.isVisible = false;
	}
	selectedPeriod.value = period;
};


</script>

<template>
	<ui-position
		ref="positionRef"
		placement="bottom-start"
		trigger="click"
	>
		<template #title="{isVisible}">
			<div :class="classes.selectWrapper" class="paragraph-p-01">
				<div :class="classes.selectedValue">{{ selectedPeriod }}</div>
				<ui-icon
					:id="IconIds.DropdownDown"
					width="12"
					height="12"
					:class="[classes.icon, isVisible ? classes.iconRotated : '']"
				/>
			</div>
		</template>
		<template #content>
			<chart-common-dropdown-layout>
				<div :class="classes.dropdown" class="paragraph-p-01">
					<div
						v-for="period in periods"
						:key="period"
						:class="[classes.option, period === selectedPeriod ? classes.optionActive : '']"
						@click="()=>handlePeriodSelect(period)"
					>
						{{ period }}
					</div>
				</div>
			</chart-common-dropdown-layout>

		</template>
	</ui-position>

</template>

<style module="classes">
.selectWrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 52px;
	padding: 5px 9px 5px 11px;
	color: var(--text-color-base-500);
	background-color: var(--metrics-bg-control-300);
	border-radius: 16px;
	cursor: pointer;
	gap: 3px;

	&:hover {
		background-color: var(--metrics-bg-control-500);
	}
}


.dropdown {
	display: flex;
	flex-direction: column;
	width: 52px;
	padding: 6px;
	overflow: hidden;
	border-radius: 16px;
	gap: 6px;
}

.option {
	padding: 2px 6px;
	cursor: pointer;
	transition: background-color 0.2s ease;
}

.option:hover {
	background-color: #3a3a3a;
}

.optionActive {
	font-weight: 500;
	background-color: #3a3a3a;
}

.icon {
	transition: transform 0.3s ease;
}

.iconRotated {
	transform: rotate(180deg);
}
</style>
