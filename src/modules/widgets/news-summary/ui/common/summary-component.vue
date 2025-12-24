<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { isToday, isYesterday } from 'date-fns';

import { UiClamped } from '@/shared/ui/clamped';
import { UiText } from '@/shared/ui/text';
import { getDateFormatter } from '@/shared/lib';
import { DashboardTooltipWrapper } from '@/shared/ui/tooltip';
import { UiPositionTooltip } from '@/shared/ui/position';

interface ISummaryComponentProps {
	text: string;
	summarizedAt: Date;
}

const props = defineProps<ISummaryComponentProps>();

const summarizedAtLabel = computed(() => {
	if (isToday(props.summarizedAt)) {
		const formatter = getDateFormatter({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
		return formatter.format(props.summarizedAt);
	}

	if (isYesterday(props.summarizedAt)) {
		const formatter = getDateFormatter({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
		const label = formatter.format(props.summarizedAt);

		return `Yesterday, ${label}`;
	}

	const formatter = getDateFormatter({
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
		month: 'short',
		day: 'numeric',
		year: '2-digit',
	});

	return formatter.format(props.summarizedAt);
});

const textWrapper = useTemplateRef('textWrapper');

const textIsClamped = ref(false);

watch(() => [props.text, textWrapper.value], () => {
	if (textWrapper.value) {
		textIsClamped.value = textWrapper.value.$el.scrollHeight > textWrapper.value.$el.clientHeight;
	} else {
		textIsClamped.value = false;
	}
}, { flush: 'post', immediate: true });
</script>

<template>
	<div :class="classes.container">
		<ui-position-tooltip placement="bottom" :open-delay="200">
			<ui-text token="text-300-r" as="div">
				<ui-clamped
					ref="textWrapper"
					:class="classes.text"
					:rows="4"
				>
					{{ props.text }}
				</ui-clamped>
			</ui-text>
			<template #content>
				<dashboard-tooltip-wrapper v-if="textIsClamped" :class="classes.wrapper">
					<ui-text token="text-200-r">{{ props.text }}</ui-text>
				</dashboard-tooltip-wrapper>
			</template>
		</ui-position-tooltip>
		<ui-text
			:class="classes.summaryAt"
			token="text-200-r"
			as="div"
		>
			Summarized at {{ summarizedAtLabel }}
		</ui-text>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.text {
	padding-right: 40px;
	color: rgb(255 255 255 / 96%);
}

.summaryAt {
	color: rgb(255 255 255 / 62%);
}

.wrapper {
	max-width: 400px;
}
</style>
