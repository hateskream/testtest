<script setup lang="ts">
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { UiText } from '@/shared/ui/text';
import { UiDelimiter } from '@/shared/ui/delimiter';
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

				<button :class="classes.requestFeature">
					<ui-icon
						:id="IconIds.Feedback"
						width="16px"
						height="16px"
					/>
					<ui-text token="text-400-r" :class="classes.requestFeatureText">
						Request a feature
					</ui-text>
				</button>
			</section>
		</div>

		<section :class="classes.right">
			<a
				href="https://x.com/i88-uk"
				target="_blank"
				rel="noopener noreferrer"
				:class="classes.socialLink"
			>
				<div :class="classes.socialIcon">
					<ui-icon
						:id="IconIds.Twitter"
						width="18px"
						height="18px"
					/>
				</div>
				<span :class="classes.socialText">@i88-uk</span>
			</a>
			<a
				href="https://discord.gg/i88-support"
				target="_blank"
				rel="noopener noreferrer"
				:class="classes.socialLink"
			>
				<div :class="classes.socialIcon">
					<ui-icon
						:id="IconIds.Discord"
						width="18px"
						height="18px"
					/>
				</div>
				<span :class="classes.socialText">@i88-support</span>
			</a>
		</section>
	</footer>
</template>

<style module="classes">
.footer {
	display: flex;
	padding:
		var(--padding-padding-s17, 44px) var(--padding-padding-s15, 36px)
		var(--padding-padding-s20, 72px) var(--padding-padding-s15, 36px);
	justify-content: space-between;
	align-items: flex-start;
	align-content: flex-start;
	row-gap: var(--padding-padding-s19, 60px);
	align-self: stretch;
	flex-wrap: wrap;
}

.left {
	display: flex;
	min-width: 180px;
	padding: 0 var(--padding-padding-s11, 20px) 0 var(--padding-padding-s2, 2px);
	align-items: flex-start;
	align-content: flex-start;
	gap: 72px var(--padding-padding-s20, 72px);
	flex: 1 0 0;
	flex-wrap: wrap;
}

.logos {
	display: flex;
	height: 32px;
	align-items: center;
	gap: 12px;
}

.delimiter {
	height: 16px;
}

.textBlock {
	display: flex;
	min-width: 180px;
	flex-direction: column;
	align-items: flex-start;
	gap: 24px;
	flex: 1 0 0;
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
	color: var(--color-text-base-300, #9A9A9D);
}

.requestFeature {
	display: flex;
	height: var(--height-height-s16, 40px);
	padding: 0 var(--padding-padding-s10, 18px) 0 var(--padding-padding-s9, 16px);
	align-items: center;
	gap: var(--padding-paddingsS4, 6px);
	border-radius: var(--radius-radius-s16-40, 15.6px);
	background: var(--bg-100, rgba(73, 73, 80, 0.32));
	cursor: pointer;
}

.requestFeature:hover {
	background: var(--bg-200, rgba(73, 73, 80, 0.48));
}

.requestFeatureText {
	overflow: hidden;
	color: var(--text-300, rgba(255, 255, 255, 0.60));
	text-overflow: ellipsis;
	line-height: 1;
}

.right {
	display: flex;
	padding: var(--padding-padding-s4, 6px) var(--padding-padding-s2, 2px);
	justify-content: flex-end;
	align-items: center;
	align-content: center;
	gap: 6px var(--tile-gap, 6px);
	flex-wrap: wrap;
}

.socialLink {
	display: flex;
	width: 128px;
	align-items: center;
	gap: 4px;
	text-decoration: none;
	color: var(--color-text-base-300, #9A9A9D);
}

.socialLink:hover {
	color: var(--color-text-base-200, #BFBFC2);
}

.socialIcon {
	width: 32px;
	height: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
}

.socialText {
	color: inherit;
	text-align: right;
	font-size: 13px;
	font-style: normal;
	font-weight: 300;
	line-height: normal;
}
</style>
