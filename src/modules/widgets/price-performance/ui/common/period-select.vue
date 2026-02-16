<script setup lang="ts">
import { useTemplateRef } from 'vue';


import { ModalBadgeDropdown, ModalBadgeList } from '@/modules/widgets/base';
import { UiModalItemSelector } from '@/shared/ui/modal-items';


interface IPeriodSelectProps {
	periods: string[];
}

const props = defineProps<IPeriodSelectProps>();


const selectedPeriod = defineModel<string>({ required: true });

const positionRef = useTemplateRef('positionRef');

const handlePeriodSelect = (period: string) => {
	selectedPeriod.value = period;
	positionRef?.value?.close();
};


</script>

<template>
	<modal-badge-dropdown
		ref="positionRef"
		display-variant="new"
		placement="bottom-start"
		trigger="click"
	>
		<template #title>
			{{ selectedPeriod }}
		</template>
		<template #content>
			<modal-badge-list display-variant="new">
				<template #title>
					Date ranges list
				</template>
				<template #default>
					<ui-modal-item-selector
						v-for="period in props.periods"
						:key="period"
						:model-value="period === selectedPeriod"
						@update:model-value="handlePeriodSelect(period)"
					>
						{{ period }}
					</ui-modal-item-selector>
				</template>
			</modal-badge-list>

		</template>
	</modal-badge-dropdown>

</template>

<style module="classes">
.selectWrapper {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 46px;
	padding: 1px 7px 1px 10px;
	color: var(--text-500, rgb(255 255 255 / 96%));
	background-color: var(--bg-100, rgb(73 73 80 / 32%));
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
	width: 46px;
	padding: 1px;
	overflow: hidden;
	gap: 6px;
}

.option {
	padding-left: 10px;
	border-radius: 6px;
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
