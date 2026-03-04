<script setup lang="ts">
import { computed } from 'vue';

import { UiImage } from '@/shared/ui/image';
import { UiTransitionFade } from '@/shared/ui/transition';
import type { IDisplaySettings, INews, ScoreType, SentimentType } from '../../model';
import { formatNewsDate } from '../../utils/date';
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';

import NewsIconScoreComponent from '../news-icon-score-component.vue';
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
			<div
				v-if="props.displaySettings.isShowSource"
				:class="classes.newsLeftImageWrapper"
			>
				<ui-image
					v-if="props.news.src_source_image"
					:class="classes.newsLeftImage"
					:src="props.news.src_source_image"
					height="14px"
					width="14px"
				/>
			</div>
		</ui-transition-fade>

		<div :class="classes.newsContent">
			<div :class="classes.newsTitle">
				<ui-text token="text-300-r" as="h3">{{ props.news.primary_title }}</ui-text>
			</div>

			<ui-transition-fade>
				<div
					v-if="props.displaySettings.isShowDesc"
					:class="classes.newsDesc"
				>
					<ui-clamped :rows="2">
						<ui-text token="text-200-r">{{ props.news.snippet }}</ui-text>
					</ui-clamped>
				</div>
			</ui-transition-fade>

			<div :class="classes.newsOther">
				<ui-transition-fade>
					<ui-text
						v-if="props.displaySettings.isShowDate"
						token="text-200-r"
						:class="classes.newsOtherText"
					>
						<time :datetime="time">
							{{ time }}
						</time>
					</ui-text>
				</ui-transition-fade>

				<ui-transition-fade>
					<span
						v-if="isShowDot"
						:class="classes.newsOtherText"
					>
						·
					</span>
				</ui-transition-fade>

				<ui-transition-fade>
					<small v-if="isShowAuthor" :class="[classes.newsOtherText, classes.newsOtherAuthorText]">
						{{ props.news.author }}
					</small>
				</ui-transition-fade>

				<ui-transition-fade>
					<news-tickers
						v-if="isShowTickers"
						:tickers="props.news.tickers!"
						display-variant="default"
					/>
				</ui-transition-fade>

				<ui-transition-fade>
					<news-icon-score-component
						v-if="props.displaySettings.isShowScore"
						:score="props.news.sentiment.score as ScoreType"
						:tone="props.news.sentiment.tone as SentimentType"
					/>
				</ui-transition-fade>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	width: 100%;
	padding: 14px 12px;
	border-radius: 18px;
	cursor: pointer;
	transition: background-color 0.3s ease;
	gap: 6px;
}

.container:hover {
	background-color: var(--bg-color-base-100-effect);
}

.newsLeftImageWrapper {
	flex-shrink: 0;
	width: 14px;
	padding: 3px 0;
}

.newsContent {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	gap: 6px;
}

.newsLeftImage {
	border-radius: 4px;
	object-fit: cover;
}

.newsOtherAuthorText {
	transition: color 0.3s ease;
}

.newsOtherAuthorText:hover {
	color: var(--text-color-base-300-effect);
	cursor: pointer;
}

.newsTitle {
	color: var(--text-color-base-500);
}

.newsDesc {
	color: var(--text-color-base-300);
}

.newsOther {
	position: relative;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
	padding-right: 32px;
}

.newsOtherText {
	line-height: 1;
	color: var(--text-color-base-300);
}
</style>
