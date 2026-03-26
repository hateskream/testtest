<script setup lang="ts">
import { computed } from 'vue';

import { MarginTrendStatus, type MarginTrendStatusType } from '../../model';
import { TagColor, UiTag } from '@/shared/ui/tag';

const props = defineProps<{
	summary: string;
	status: MarginTrendStatusType;
}>();

const marginTrendStatusToColor = {
	[MarginTrendStatus.Positive]: TagColor.Positive,
	[MarginTrendStatus.Negative]: TagColor.Negative,
	[MarginTrendStatus.Neutral]: TagColor.Neutral,
} as const;

const color = computed(() => marginTrendStatusToColor[props.status]);
</script>

<template>
	<ui-tag :color="color">
		<span>{{ props.summary }}</span>
	</ui-tag>
</template>
