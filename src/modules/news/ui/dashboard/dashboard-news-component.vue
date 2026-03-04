<script setup lang="ts">
import { computed } from 'vue';

import { UiTransitionFade } from '@/shared/ui/transition';
import { UiImage } from '@/shared/ui/image';
import { formatNewsDate } from '../../utils/date';
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';
import type { IDisplaySettings, INews } from '../../model';

import NewsTickers from '../common/news-tickers.vue';

interface INewsComponent {
	news: INews;
	displaySettings: IDisplaySettings;
	displayVariant: 'tv' | 'dashboard';
}

const props = defineProps<INewsComponent>();

const time = computed(() => formatNewsDate(props.news.updated_at));

const isShowAuthor = computed(
	() => props.displaySettings.isShowAuthor && props.news.author,
);
const isShowTickers = computed(
	() => props.displaySettings.isShowSymbols && props.news.tickers?.length,
);

const isShowDot = computed(() => {
	const hasLeft = props.displaySettings.isShowDate;
	const hasRight = isShowAuthor.value || isShowTickers.value;

	return hasLeft && hasRight;
});
</script>

<template>
	<div :class="classes.container">
		<ui-transition-fade>
			<div v-if="props.displaySettings.isShowSource" :class="classes.left">
				<ui-image
					v-if="props.news.src_source_image"
					:class="classes.icon"
					:src="props.news.src_source_image"
					width="14px"
					height="14px"
				/>
			</div>
		</ui-transition-fade>

		<div :class="classes.right">
			<ui-text
				:class="classes.title"
				token="text-300-r"
				as="h3"
			>
				{{ props.news.primary_title }}
			</ui-text>

			<ui-transition-fade>
				<ui-clamped
					v-if="props.displaySettings.isShowDesc"
					:rows="2"
					:class="classes.description"
				>
					<ui-text token="text-200-r">{{props.news.snippet }}</ui-text>
				</ui-clamped>
			</ui-transition-fade>

			<div :class="classes.controls">
				<div :class="classes.leftControls">
					<ui-transition-fade>
						<ui-text
							v-if="props.displaySettings.isShowDate"
							:class="classes.time"
							token="text-200-r"
						>
							{{time}}
						</ui-text>
					</ui-transition-fade>
					<ui-transition-fade>
						<ui-text
							v-if="isShowDot"
							:class="classes.dot"
							token="text-100-r"
						>
							·
						</ui-text>
					</ui-transition-fade>
					<ui-transition-fade>
						<ui-text
							v-if="isShowAuthor"
							:class="classes.author"
							token="text-200-r"
						>
							{{props.news.author}}
						</ui-text>
					</ui-transition-fade>

					<ui-transition-fade>
						<news-tickers
							v-if="isShowTickers"
							:tickers="props.news.tickers!"
							display-variant="new"
						/>
					</ui-transition-fade>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: flex-start;
	align-self: stretch;
	padding: 14px 12px;
	cursor: pointer;
	transition: background-color 0.2s ease-in-out;
	user-select: none;
	gap: 6px;
}

.container:hover {
	background: var(--atom-base-70, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s14-32, 12.4px);
}

.left {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 14px;
	height: 20px;
	padding: 3px 0;
}

.icon {
	display: flex;
	flex-shrink: 0;
	justify-content: center;
	align-items: center;
	width: 14px;
	min-width: 14px;
	height: 14px;
	aspect-ratio: 1/1;
	border-radius: 2px;
	object-fit: cover;
}

.right {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	gap: 6px;
}

.title {
	align-self: stretch;
	color: var(--text-500, rgb(255 255 255 / 96%));
}

.description {
	align-self: stretch;
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.controls {
	display: flex;
	align-items: flex-start;
	gap: 6px;
	align-self: stretch;
}

.leftControls {
	display: flex;
	flex: 1 0 0;
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	gap: 2px 6px;
}

.time {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.dot {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.author {
	color: var(--text-300, rgb(255 255 255 / 62%));
}


</style>
