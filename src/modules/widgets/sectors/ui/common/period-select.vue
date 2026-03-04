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
</style>
