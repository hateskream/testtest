<script setup lang="ts">
import { type INewsSource } from '@/modules/news';
import { UiText } from '@/shared/ui/text';

const props = defineProps<{
	sources: INewsSource[];
}>();
</script>

<template>
	<section :class="classes.sources">
		<h3 class="title-100">Sources</h3>
		<ul :class="classes.sourceList" class="text-300-r">
			<li
				v-for="source in props.sources"
				:key="source.url"
				:class="classes.source"
			>
				<span :class="classes.source"><a :href="source.url">{{ source.site }}</a> /</span>
			</li>
		</ul>
		<ui-text token="text-50-r" :class="classes.note">Summarised by i88</ui-text>
	</section>
</template>

<style module="classes">
.sources {
	display: flex;
	flex-direction: column;
	gap: 6px;
	width: 100%;
}

.sourceList {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.source {
	white-space: nowrap;
}

.sourceList a {
	color: var(--color-text-base-300, #9a9a9d);
	text-decoration: underline dotted;
	text-decoration-skip-ink: none;
	text-decoration-thickness: 6.5%;
	text-underline-offset: auto;
	text-underline-position: from-font;
}

.note {
	color: var(--color-text-base-100, #646568);
}
</style>
