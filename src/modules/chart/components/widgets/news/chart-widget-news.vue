<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';
import { h, useCssModule } from 'vue';

import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';

const markdown = new MarkdownIt({ html: true, linkify: true, typographer: true });

// Access CSS module
const classes = useCssModule('classes');

interface INewsProps {
	markdownText: string;
}

const props = defineProps<INewsProps>();

const renderMarkdown = () => {
	const html = markdown.render(props.markdownText);
	const sanitized = DOMPurify.sanitize(html);
	console.log('not sanitized markdown', props.markdownText);

	return h('div', {
		innerHTML: sanitized,
		class: [classes.markdownWrapper, 'paragraph-p-01'],
	});
};
</script>

<template>
	<chart-common-widget-layout>
		<template #header>
			Price today is <span :class="classes.potential">Optimistic</span>
		</template>
		<template #body>
			<div :class="classes.bodyWrapper">
				<component :is="renderMarkdown" />
				<div :class="classes.summarized" class="paragraph-p-02">
					Summarized at 19:30
				</div>
			</div>
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.potential {
	display: inline-flex;
	align-items: center;
	padding: 1px 5px;
	font-weight: 440;
	font-size: 10px;
	line-height: 17px;
	color: #04eda0;
	background-color: rgb(31 31 31 / 70%);
	border-radius: 4px;
	gap: 4px;
}

.summarized {
	color: var(--text-color-base-300);
}

.markdownWrapper :global(strong) {
	font-weight: 400;
	color: #04eda0;
}

.bodyWrapper {
	display: flex;
	flex-direction: column;
	gap: 8px;
}
</style>
