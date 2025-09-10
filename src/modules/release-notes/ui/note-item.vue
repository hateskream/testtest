<script setup lang="ts">
import { computed, ref } from 'vue';

import type { INoteItem } from '../model';

interface IWeekGroupProps {
	note: INoteItem;
}

const props = defineProps<IWeekGroupProps>();

const expanded = ref(false);
const TRUNCATE_LENGTH = 160;

const isTruncatable = computed(() => props.note.description.length > TRUNCATE_LENGTH);

const truncated = computed(() => {
	if (!isTruncatable.value) {
		return props.note.description;
	}
	return props.note.description.slice(0, TRUNCATE_LENGTH).trimEnd() + '…';
});

</script>

<template>
	<div class="note-item">
		<div class="note-header">
			<h4 class="note-title">{{ props.note.title }}</h4>
			<div class="note-links">
				<a
					v-if="props.note.productLink"
					:href="props.note.productLink"
					target="_blank"
					rel="noopener"
				>Продукт</a>
				<a
					v-if="props.note.figmaLink"
					:href="props.note.figmaLink"
					target="_blank"
					rel="noopener"
				>Figma</a>
			</div>
		</div>

		<p class="note-desc">
			<span v-if="!expanded">{{ truncated }}</span>
			<span v-else>{{ props.note.description }}</span>
		</p>

		<button
			v-if="isTruncatable"
			class="toggle-desc"
			@click="expanded = !expanded"
		>
			{{ expanded ? 'Свернуть' : 'Читать полностью' }}
		</button>
	</div>
</template>

<style scoped>
.note-item {
	margin: 0;
	padding: 12px 16px;
	background: rgb(255 255 255 / 3%);
	border-radius: 10px;
	will-change: transform, opacity;
}

.note-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 12px;
}

.note-title {
	margin: 0;
	font-size: 1rem;
	color: #ffffff;
}

.note-links a {
	margin-left: 8px;
	font-size: 0.9rem;
	color: #ffffff;
	text-decoration: underline;
	opacity: 0.85;
}

.note-desc {
	margin: 8px 0 0;
	line-height: 1.4;
	color: #ffffff;
	opacity: 0.95;
}

.toggle-desc {
	margin-top: 8px;
	padding: 6px 10px;
	font-size: 0.85rem;
	color: #ffffff;
	background: transparent;
	border: 1px solid rgb(255 255 255 / 8%);
	border-radius: 8px;
	cursor: pointer;
}
</style>
