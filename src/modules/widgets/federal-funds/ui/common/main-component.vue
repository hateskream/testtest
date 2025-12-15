<script setup lang="ts">
import { computed } from 'vue';

import type { IFederalFundsDomain } from '@/modules/widgets/federal-funds/model';
import { UiText } from '@/shared/ui/text';

interface IMainComponentProps {
	data: IFederalFundsDomain;
}

const props = defineProps<IMainComponentProps>();

const reviewDateLabel = computed(() => {
	// TODO: [PERF] Вынести в DateFormatter
	return new Date(props.data.next_review_date).toLocaleDateString([], {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
});
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.title">
			<img
				:class="classes.flag"
				src="https://flagcdn.com/us.svg"
				alt="US flag"
			/>
			<ui-text token="title-200">{{ props.data.rate }}%</ui-text>
		</div>
		<ui-text
			:class="classes.text"
			token="text-200-r"
			as="p"
		>
			Next FOMC review scheduled for {{ reviewDateLabel }}
		</ui-text>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-direction: column;
	gap: 12px;
	padding: 12px 0 20px 20px;
}

.title {
	display: flex;
	align-items: center;
	color: rgb(255 255 255 / 96%);
	gap: 6px;
}

.flag {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	object-fit: cover;
	object-position: 25%;
}

.text {
	color: rgb(255 255 255 / 62%);
}
</style>
