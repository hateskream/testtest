<script setup lang="ts">
import { computed } from 'vue';

import { ActivityMetricsSentiment, getSentimentColor, getSentimentIcon } from '../../model';
import { UiTag } from '@/shared/ui/tag';
import { UiIcon } from '@/shared/ui/icon';

const props = defineProps<{
	sentiment: ActivityMetricsSentiment;
}>();

const color = computed(() => getSentimentColor(props.sentiment));
const icon = computed(() => getSentimentIcon(props.sentiment));
</script>

<template>
	<ui-tag :color="color">
		<span>{{ props.sentiment }}</span>
		<template v-if="icon" #icon>
			<ui-icon
				:id="icon"
				height="8"
				width="8"
			/>
		</template>
	</ui-tag>
</template>
