<script setup lang="ts">
import {ref} from 'vue';
import {useVModel} from '@vueuse/core';
import {UiPosition} from '@/shared/ui/position';
import {IconIds, UiIcon} from "@/shared/ui/icon";
import ChartDropdownLayout from "@/modules/chart/components/header/chart-dropdown-layout.vue";

const props = defineProps<{
	periods: string[];
	modelValue: string | undefined;
}>();

const emit = defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

// Use VueUse's useVModel for cleaner v-model handling
const selectedPeriod = useVModel(props, 'modelValue', emit);




// Use VueUse's onClickOutside for cleaner click-outside detection

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
		position="bottom-start"
		trigger="click"
	>
		<template #default="{isVisible}">
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
			<chart-dropdown-layout>
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
			</chart-dropdown-layout>

		</template>
	</ui-position>

</template>

<style module="classes">

.selectWrapper {
	display: flex;
	align-items: center;
	background-color: #2a2a2a;
	color: white;
	border: none;
	border-radius: 16px;
	padding: 5px 9px 5px 11px;
	cursor: pointer;
	width: 52px;
	justify-content: space-between;
	gap:3px;
}

.selectedValue {
	font-weight: 500;
}


.dropdown {
	border-radius: 16px;
	overflow:hidden;
	padding: 6px;
	display:flex;
	flex-direction: column;
	gap: 6px;
	width:52px;
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
	background-color: #3a3a3a;
	font-weight: 500;
}
.icon {
	transition: transform 0.3s ease;
}
.iconRotated {
	transform: rotate(180deg);

}
</style>
