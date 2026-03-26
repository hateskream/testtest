<script setup lang="ts">
import DOMPurify from 'dompurify';
import { h } from 'vue';
import MarkdownIt from 'markdown-it';

import type { SectorsAnalysis } from '../../../model';

interface IProps {
	data: SectorsAnalysis;
}

const props = defineProps<IProps>();

const markdown = new MarkdownIt({ breaks: true, typographer: true });

const renderMarkdown = () => {
	const html = markdown.render(props.data.summary);
	const sanitized = DOMPurify.sanitize(html);
	return h('div', { innerHTML: sanitized });
};
</script>
<template>
	<div class="text-300-r" :class="classes.view">
		<component :is="renderMarkdown" :class="classes.render" />
	</div>
</template>

<style module="classes">
.view {
	display: flex;
	flex-direction: column;
	min-height: 0;
	padding: var(--padding-s7, 12px) var(--padding-s11, 20px) var(--padding-s14, 32px) var(--padding-s11, 20px);
	overflow-y: auto;
	color: #8759fc;
}

.render {
	ul,
	ol {
		margin: 0;
		padding-left: 1.5em;
	}

	li {
		margin: 0.25em 0;
		list-style: unset;
	}

	ul {
		list-style-type: disc;
	}

	ul ul {
		list-style-type: circle;
	}

	ul ul ul {
		list-style-type: square;
	}

	ol {
		list-style-type: decimal;
	}

	summary {
		display: list-item;
	}

	[hidden] {
		display: none !important;
	}

	p {
		margin-top: 0;
		margin-bottom: 10px;
	}

	abbr[title] {
		text-decoration: underline dotted;
		border-bottom: none;
	}
}
</style>
