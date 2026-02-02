<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import { UiDelimiter } from '@/shared/ui/delimiter';
import { UiControlButton } from '@/shared/ui/control-button';
import { getFeatureValue } from '@/shared/lib';

const featureRequestLink = getFeatureValue('I88_FEATURE_REQUEST_LINK');
const twitterPageLink = getFeatureValue('I88_TWITTER_PAGE_LINK');
const discordSupportLink = getFeatureValue('I88_DISCORD_SUPPORT_LINK');
</script>

<template>
	<footer :class="classes.footer">
		<div :class="classes.left">
			<section :class="classes.logos">
				<ui-icon
					:id="IconIds.GlobusLogo"
					width="22px"
					height="22px"
				/>
				<ui-delimiter :class="classes.delimiter" />
				<ui-icon
					:id="IconIds.Logo"
					:class="classes.i88"
					width="62px"
				/>
			</section>

			<section :class="classes.textBlock">
				<div :class="classes.head">
					<ui-text token="title-400">
						Missing feature?
					</ui-text>

					<ui-text token="text-400-r" :class="classes.subheading">
						Describe your idea and we’ll make it happen
					</ui-text>
				</div>

				<a
					v-if="featureRequestLink"
					:href="featureRequestLink"
					target="_blank"
					rel="noopener noreferrer"
					:class="classes.socialLink"
				>
					<ui-control-button token="l-24-bg" :icon-id="IconIds.Feedback">
						Request a feature
					</ui-control-button>
				</a>
			</section>
		</div>

		<section :class="classes.right">
			<a
				v-if="twitterPageLink"
				:href="twitterPageLink"
				target="_blank"
				rel="noopener noreferrer"
				:class="classes.socialLink"
			>
				<ui-control-button token="m-24" :icon-id="IconIds.Twitter">
					@i88-uk
				</ui-control-button>
			</a>
			<a
				v-if="discordSupportLink"
				:href="discordSupportLink"
				target="_blank"
				rel="noopener noreferrer"
				:class="classes.socialLink"
			>
				<ui-control-button token="m-24" :icon-id="IconIds.Discord">
					@i88-support
				</ui-control-button>
			</a>
		</section>
	</footer>
</template>

<style module="classes">
.footer {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-content: flex-start;
	align-items: flex-start;
	align-self: stretch;
	padding:
		var(--padding-padding-s17, 44px) var(--padding-padding-s15, 36px)
		var(--padding-padding-s20, 72px) var(--padding-padding-s15, 36px);
	row-gap: var(--padding-padding-s19, 60px);
}

.left {
	display: flex;
	flex: 1 0 0;
	flex-wrap: wrap;
	align-content: flex-start;
	align-items: flex-start;
	min-width: 180px;
	padding: 0 var(--padding-padding-s11, 20px) 0 var(--padding-padding-s2, 2px);
	gap: 72px var(--padding-padding-s20, 72px);
}

.logos {
	display: flex;
	align-items: center;
	height: 32px;
	gap: 12px;
}

.delimiter {
	height: 16px;
}

.textBlock {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: flex-start;
	min-width: 180px;
	gap: 24px;
}

.head {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 12px;
	align-self: stretch;
}

.subheading {
	width: 187px;
	color: var(--color-text-base-300, #9a9a9d);
}

.requestFeature {
	display: flex;
	align-items: center;
	height: var(--height-height-s16, 40px);
	padding: 0 var(--padding-padding-s10, 18px) 0 var(--padding-padding-s9, 16px);
	background: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-radius-s16-40, 15.6px);
	cursor: pointer;
	gap: var(--padding-paddings-s4, 6px);
}

.requestFeature:hover {
	background: var(--bg-200, rgb(73 73 80 / 48%));
}

.requestFeatureText {
	overflow: hidden;
	line-height: 1;
	color: var(--text-300, rgb(255 255 255 / 60%));
	text-overflow: ellipsis;
}

.right {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-end;
	align-content: center;
	align-items: center;
	padding: var(--padding-padding-s4, 6px) var(--padding-padding-s2, 2px);
	gap: 6px var(--tile-gap, 6px);
}

.socialLink {
	text-decoration: none;
}

.socialText {
	font-style: normal;
	font-weight: 300;
	font-size: 13px;
	line-height: normal;
	text-align: right;
	color: inherit;
}
</style>
