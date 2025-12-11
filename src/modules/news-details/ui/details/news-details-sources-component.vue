<script setup lang="ts">
import { Source, sourceToName } from '@/modules/news';

defineProps<{
	sources: Source[];
}>();
</script>

<template>
	<section :class="classes.sources">
		<h3 :class="classes.subheading">Sources</h3>
		<ul :class="classes.sourceList">
			<li
				v-for="source in sources"
				:key="source"
				:class="classes.source"
			>
				<a :href="source">{{ sourceToName[source] }}</a> /
			</li>
		</ul>
		<span :class="classes.note">Summarised by i88</span>
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
	font-weight: 440;
	font-size: var(--typography-menu-caption, 12px);
	line-height: 1.7;
	letter-spacing: 0.096px;
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
	font-weight: 440;
	font-size: 10px;
	line-height: 1.7;
	color: var(--color-text-base-100, #646568);
}
</style>
