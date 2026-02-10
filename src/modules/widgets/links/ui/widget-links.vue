<script setup lang="ts">
import { UiImage } from '@/shared/ui/image';
import { TickerControlLink } from '@/modules/ticker/ui/base';
import { UiTag } from '@/shared/ui/tag';
import { UiClamped } from '@/shared/ui/clamped';
import type { Links } from '../model';

import WidgetLinksRow from './widget-links-row.vue';

const props = defineProps<{
	content: Links;
}>();
</script>

<template>
	<div :class="classes.container">
		<widget-links-row v-if="props.content.tags?.length" title="Tags">
			<template #content>
				<div :class="[classes.list, classes.chipWrapper]">
					<ui-tag v-for="tag in props.content?.tags" :key="tag">
						<ui-clamped :rows="1">{{ tag }}</ui-clamped>
					</ui-tag>
				</div>
			</template>
		</widget-links-row>
		<widget-links-row v-if="props.content.website" title="Website">
			<template #content>
				<ticker-control-link
					external
					:to="props.content.website.link"
				>
					{{props.content.website.label}}
				</ticker-control-link>
			</template>
		</widget-links-row>
		<widget-links-row v-if="props.content.socials?.length" title="Socials">
			<template #content>
				<div v-if="props.content" :class="[classes.list, classes.socials]">
					<a
						v-for="(item, index) in props.content.socials"
						:key="index"
						:href="item.link"
						:class="classes.socialItem"
						target="_blank"
						rel="noopener noreferrer"
					>
						<ui-image
							:src="item.logoUrl"
							width="20px"
							height="20px"
						/>
					</a>
				</div>
			</template>
		</widget-links-row>
	</div>
</template>

<style module="classes">
.container {
	width: 100%;
	padding: 0 var(--padding-padding-s11, 20px);
}

.list {
	display: flex;
	flex: 1 0 0;
	flex-wrap: wrap;
	justify-content: flex-end;
	align-content: flex-start;
	align-items: flex-start;
}

.chipWrapper {
	gap: var(--padding-s3, 4px);
}

.socials {
	gap: var(--padding-s4, 6px);
}

.socialItem {
	overflow: hidden;
	line-height: 0;
	border-radius: 50%;
}
</style>
