<script setup lang="ts">
import { computed } from 'vue';

import type { CompanyHeadquarters } from '../../model';
import { UiImage } from '@/shared/ui/image';
import { UiText } from '@/shared/ui/text';

import HeadquartersCitiesList from '../headquarters-cities-list.vue';

const props = withDefaults(defineProps<{
	data: CompanyHeadquarters;
	isFullscreen: boolean;
	maxRegions?: number;
}>(), {
	maxRegions: 4,
});

const displayedRegions = computed(() => {
	return props.isFullscreen ?
		props.data.regions :
		props.data.regions.slice(0, props.maxRegions);
});
</script>

<template>
	<div :class="{[classes.fullscreen]: props.isFullscreen}">
		<div
			v-for="region in displayedRegions"
			:key="region.region"
			:class="classes.region"
		>
			<div :class="classes.cell">
				<ui-image
					:src="region.image_url"
					:class="classes.image"
					width="20px"
					height="20px"
				/>
				<div :class="classes.label">
					<ui-text token="text-300-r">{{ region.region }}</ui-text>
				</div>
			</div>
			<headquarters-cities-list
				:cities="region.cities"
				:show-all="isFullscreen"
			/>
		</div>
	</div>
</template>

<style module="classes">
.fullscreen {
	max-width: 612px;
	max-height: 794px;
}

.region {
	display: flex;
	align-items: flex-start;
	align-self: stretch;
	padding: var(--padding-padding-s6, 10px);
	border-bottom: 1px solid var(--color-border-surface-02, rgb(199 199 199 / 10%));
}

.cell {
	display: flex;
	flex: 1 0 0;
	align-items: center;
	min-width: 80px;
	height: var(--height-height-s15, 36px);
	padding: 8px var(--padding-padding-s6, 10px);
	gap: var(--padding-padding-s4, 6px);
}

.image {
	border-radius: 50%;
	aspect-ratio: 1 / 1;
}

.label {
	display: flex;
	align-items: center;
	height: 24px;
}
</style>
