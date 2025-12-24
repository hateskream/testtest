<script setup lang="ts">
import { DashboardTooltipWrapper } from '@/shared/ui/tooltip';
import { UiPositionTooltip } from '@/shared/ui/position';

interface IChartBarHourLabelProps {
	showTooltip?: boolean;
	tooltipContent?: string;
}

const props = defineProps<IChartBarHourLabelProps>();
</script>

<template>
	<ui-position-tooltip
		v-if="props.showTooltip"
		placement="top"
		:open-delay="50"
	>
		<template #default>
			<slot />
		</template>
		<template #content>
			<dashboard-tooltip-wrapper>
				<slot name="tooltip-content">{{ tooltipContent }}</slot>
			</dashboard-tooltip-wrapper>
		</template>
	</ui-position-tooltip>
	<slot v-else />
</template>
