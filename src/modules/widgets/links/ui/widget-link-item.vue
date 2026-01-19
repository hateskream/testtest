<script setup lang="ts">
import { UiText } from '@/shared/ui/text';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiImage } from '@/shared/ui/image';
import type { IContentItem } from '../model/contract.ts';
import { DashboardPillItem, DashboardPillWrapper } from '@/shared/ui/pill';

import WidgetLinkWebsiteSkeleton from '@/modules/widgets/links/ui/skeletons/widget-link-website-skeleton.vue';
import WidgetLinkSocialsSkeleton from '@/modules/widgets/links/ui/skeletons/widget-link-socials-skeleton.vue';

const props = defineProps<{
	content?: IContentItem;
}>();
</script>

<template>
	<div :class="classes.wrapper">
		<div :class="classes.row">
			<ui-text :class="classes.left" token="text-100-r">
				Website
			</ui-text>

			<a
				v-if="props.content"
				:href="props.content.website.url"
				target="_blank"
				rel="noopener noreferrer"
			>
				<dashboard-pill-wrapper :class="classes.pills">
					<dashboard-pill-item :class="classes.pillLabel">
						{{props.content.website.label}}
					</dashboard-pill-item>
					<dashboard-pill-item :class="classes.pillIcon">
						<ui-icon
							:id="IconIds.ArrowToTopRight"
							width="16px"
							height="16px"
						/>
					</dashboard-pill-item>
				</dashboard-pill-wrapper>
			</a>

			<widget-link-website-skeleton v-else />
		</div>
		<div :class="classes.row">
			<ui-text :class="classes.left" token="text-100-r">
				Socials
			</ui-text>

			<div v-if="props.content" :class="classes.socials">
				<a
					v-for="(item, index) in props.content.socials"
					:key="index"
					:href="item.url"
					:class="classes.socialItem"
					target="_blank"
					rel="noopener noreferrer"
				>
					<ui-image
						:src="item.icon"
						width="20px"
						height="20px"
					/>
				</a>
			</div>

			<widget-link-socials-skeleton v-else />
		</div>
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	max-width: 100%;
	padding: 8px 0;
	background: var(--surface-01, rgb(17 17 19 / 92%));
	border: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-radius: 0 18px 18px;
	gap: 6px;
}

.row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: var(--padding-padding-s7, 12px);
	height: 40px;
	padding: 0 21px;
}

.left {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.pills {
	width: unset;
	padding: 0;
	grid-auto-columns: unset;
}

.pillIcon {
	width: 28px;
	padding: 0;
}

.socials {
	display: flex;
	gap: 6px;
}

.socialItem {
	overflow: hidden;
	line-height: 0;
	border-radius: 50%;
}
</style>
